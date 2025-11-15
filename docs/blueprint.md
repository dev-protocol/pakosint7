# **App Name**: PakIdentity Lookup

## Core Features:

- Query Processing: Accepts mobile numbers or CNIC as input and classifies the query type.
- Data Fetching: Fetches data from the upstream source (pakistandatabase.com) based on the provided query.
- Data Parsing: Parses the HTML response from the upstream source to extract relevant information such as mobile number, name, CNIC, and address.
- Results Presentation: Presents the extracted information in a structured JSON format.
- Rate Limiting: Enforces rate limiting to prevent abuse of the API.
- Error Handling: Handles errors gracefully and returns informative error messages to the user.

## Style Guidelines:

- Primary color: Dark blue (#224B8A) to convey trust and security, suitable for a service handling sensitive information.
- Background color: Light gray (#F0F4F8), a desaturated version of the primary blue to maintain focus on the data.
- Accent color: Soft orange (#D98E53) for interactive elements and call-to-action buttons.
- Body and headline font: 'Inter', a sans-serif font known for its modern, clean, and readable style.
- Simple, geometric icons to represent data categories and actions.
- Clean, tabular layout for presenting search results, ensuring readability and easy navigation.