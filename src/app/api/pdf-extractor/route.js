"use server"



const fs = require('fs');
const path = require('path');
const PDFParser = require('pdf2json');

export const POST = async (req) => {
    try {
        // Parse incoming form data using native Next.js approach
        const formData = await req.formData();

        // Extract the PDF file from the form data
        const file = formData.get('pdf');

        if (!file) {
            return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
        }


        // Convert the file into a buffer for processing
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        // Create a temporary file to save the uploaded PDF
        const tempPdfPath = path.join(__dirname, 'tempfile.pdf');
        await fs.promises.writeFile(tempPdfPath, fileBuffer);

        const pdfParser = new PDFParser();


        // Parse the PDF and extract data
        const extractedDataPromise = new Promise((resolve, reject) => {
            pdfParser.on('pdfParser_dataReady', (pdfData) => {
                resolve(pdfData); // Resolve the promise with the extracted data
            });

            pdfParser.on('pdfParser_dataError', (err) => {
                reject(err); // Reject the promise in case of error
            });

            // Load and parse the saved PDF
            pdfParser.loadPDF(tempPdfPath);
        });

        // Wait for the PDF to be parsed and then send the response
        const extractedData = await extractedDataPromise;

        // Clean up by removing the temporary file
        await fs.promises.unlink(tempPdfPath);

        // const questions = processQuestions(pdfData);


        const questions = [];
        let currentQuestion = null;

        // Iterate through the text blocks
        extractedData.Pages.forEach(page => {
            page.Texts.forEach(textObject => {
                textObject.R.forEach(run => {
                    const text = run.T.trim();

                    // Look for question patterns (e.g., "Q.1", "Q.2", etc.)
                    if (/^Q\.\d+/.test(text)) {
                        // If we already have a question, push it to the questions array
                        if (currentQuestion) {
                            questions.push(currentQuestion);
                        }
                        // Start a new question
                        currentQuestion = { question: text, options: [] };
                    }
                    // Look for options (e.g., "a)", "b)", etc.)
                    else if (/^[a-d]\)/.test(text)) {
                        // Add options to the current question
                        if (currentQuestion) {
                            currentQuestion.options.push(text);
                        }
                    }
                });
            });
        });

        // Add the last question to the list
        if (currentQuestion) {
            questions.push(currentQuestion);
        }

        console.log("PPP ",questions)


        // Send the extracted text as a JSON response
        return new Response(JSON.stringify({ text: extractedData }), { status: 200 });
    } catch (error) {
        console.error('Error processing PDF:', error);
        return new Response(JSON.stringify({ error: 'Failed to process the PDF' }), { status: 500 });
    }
};
