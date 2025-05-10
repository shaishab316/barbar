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
DIFF=$(git diff)
NEW_FILES=$(git ls-files --others --exclude-standard)

# Exit if no changes or new files are detected
if [ -z "$DIFF" ] && [ -z "$NEW_FILES" ]; then
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

# Read new files content and escape for JSON compatibility
read_new_files_content() {
  NEW_FILE_CONTENTS=""
  for FILE in $NEW_FILES; do
    if [ -f "$FILE" ]; then
      FILE_CONTENT=$(cat "$FILE")
      ESCAPED_CONTENT=$(escape_json "$FILE_CONTENT")
      NEW_FILE_CONTENTS+="$FILE:\n$ESCAPED_CONTENT\n\n"
    fi
  done
  echo "$NEW_FILE_CONTENTS"
}

# Generate commit message using AI
generate_commit_message() {
  ESCAPED_DIFF=$(escape_json "$DIFF")
  ESCAPED_NEW_FILES_CONTENT=$(read_new_files_content)

  # Make API request to Gemini and capture the response
  AI_RESPONSE=$(curl -s -X POST "$AI_API_ENDPOINT?key=$AI_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "contents": [{
        "parts": [{
          "text": "Generate a concise commit message summarizing the following code changes and new files content: \n\n'"$ESCAPED_DIFF"' \n\n New files content: \n\n'"$ESCAPED_NEW_FILES_CONTENT"'"
        }]
      }]
    }')

  # Extract commit message from the AI response or fall back to a default message
  COMMIT_MSG=$(echo "$AI_RESPONSE" | sed -n 's/.*"text": "\(.*\)".*/\1/p' | sed 's/\\n/\n/g')

  # Fallback commit message if AI fails
  [ -z "$COMMIT_MSG" ] && COMMIT_MSG="Auto-generated commit for changes in $DIR"
}

# Generate commit message
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
    git add . && git commit -m "$COMMIT_MSG" && git push
    echo -e "${GREEN}Changes committed and pushed successfully!${NC}"
    break
  elif [[ $input == $'\e' ]]; then  # Esc pressed, skip commit
    echo -e "${RED}Commit skipped. Exiting...${NC}"
    exit 0
  fi
done
