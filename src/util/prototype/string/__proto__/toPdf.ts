/* eslint-disable no-unused-vars */
import puppeteer, { PDFOptions } from 'puppeteer';

declare global {
  interface String {
    /**
     * Converts a string (HTML) to a PDF buffer using Puppeteer.
     * @returns {Promise<Buffer>}
     */
    toPdf(options?: PDFOptions): Promise<Buffer>;
  }
}

Object.defineProperties(String.prototype, {
  toPdf: {
    value: async function (
      options: PDFOptions = {
        format: 'A4',
        printBackground: true,
      },
    ): Promise<Buffer> {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.setContent(this, { waitUntil: 'load' });

      const buffer = await page.pdf(options);

      await browser.close();
      return Buffer.from(buffer);
    },
  },
});

export {};
