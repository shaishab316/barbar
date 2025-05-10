#!/bin/bash

# Load environment variables from .env file (if it exists)
[ -f .env ] && export $(grep -v '^#' .env | xargs)

# Colors for better visibility
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

DIR=$(pwd)

# Check if there are staged changes and unstaged files
STAGED_FILES=$(git diff --cached --name-only)
DIFF=$(git diff)
NEW_FILES=$(git ls-files --others --exclude-standard)

# Exit if no changes or new files are detected
if [ -z "$STAGED_FILES" ] && [ -z "$DIFF" ] && [ -z "$NEW_FILES" ]; then
  echo -e "${YELLOW}No changes or new files detected. Exiting.${NC}"
  exit 1
fi

# Set AI API endpoint and key
AI_API_KEY="${GEMINI_KEY}"  # Make sure GEMINI_KEY is set in .env
AI_API_ENDPOINT="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

# Escape special characters in the diff content for JSON compatibility
escape_json() {
  echo "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g' -e 's/\n/\\n/g' -e 's/\t/\\t/g'
}

# Get the diff of staged files to provide detailed changes
get_staged_diff() {
  STAGED_DIFF=$(git diff --cached)  # This will show the diff of staged files
  echo "$STAGED_DIFF"
}

# Get the diff of unstaged files to provide detailed changes
get_unstaged_diff() {
  UNSTAGED_DIFF=$(git diff)  # This will show the diff of unstaged files
  echo "$UNSTAGED_DIFF"
}

# Generate commit message using AI
generate_commit_message() {
  if [ -n "$STAGED_FILES" ]; then
    # Get the staged diff content
    STAGED_DIFF=$(get_staged_diff)
    ESCAPED_STAGED_DIFF=$(escape_json "$STAGED_DIFF")

    # Use the staged diff directly for more accurate commit message generation
    MESSAGE="Generate a concise commit message summarizing the following staged changes: \n\n$ESCAPED_STAGED_DIFF"
  elif [ -n "$DIFF" ]; then
    # Get the unstaged diff content
    UNSTAGED_DIFF=$(get_unstaged_diff)
    ESCAPED_UNSTAGED_DIFF=$(escape_json "$UNSTAGED_DIFF")

    # Use the unstaged diff directly for more accurate commit message generation
    MESSAGE="Generate a concise commit message summarizing the following unstaged changes: \n\n$ESCAPED_UNSTAGED_DIFF"
  fi

  # Make API request to Gemini and capture the response
  AI_RESPONSE=$(curl -s -X POST "$AI_API_ENDPOINT?key=$AI_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "contents": [{
        "parts": [{
          "text": "'"$MESSAGE"'"
        }]
      }]
    }')

  # Extract commit message from the AI response or fall back to a default message
  COMMIT_MSG=$(echo "$AI_RESPONSE" | sed -n 's/.*"text": "\(.*\)".*/\1/p' | sed 's/\\n/\n/g')

  # Fallback commit message if AI fails
  [ -z "$COMMIT_MSG" ] && COMMIT_MSG="Auto-generated commit for changes in $DIR"
}

# If there are staged files, process them, otherwise fallback to unstaged changes
generate_commit_message

# Show the generated commit message
echo -e "${BLUE}Generated Commit Message:${NC}"
echo -e "${GREEN}$COMMIT_MSG${NC}"

# Prompt user to confirm or cancel the commit
echo -e "${YELLOW}Press Enter to confirm the commit message or Esc to cancel.${NC}"

# Capture keypress (wait for Enter or Esc)
while true; do
  read -rsn1 input
  if [[ $input == "" ]]; then  # Enter pressed, proceed with commit
    if [ -n "$STAGED_FILES" ]; then
      git commit -m "$COMMIT_MSG" && git push
      echo -e "${GREEN}Staged changes committed and pushed successfully!${NC}"
    else
      git add . && git commit -m "$COMMIT_MSG" && git push
      echo -e "${GREEN}Changes committed and pushed successfully!${NC}"
    fi
    break
  elif [[ $input == $'\e' ]]; then  # Esc pressed, skip commit
    echo -e "${RED}Commit skipped. Exiting...${NC}"
    exit 0
  fi
done
