export default async function readJSON(filePath) {
    const response = await fetch(filePath);
    if (response.status === 200) {
        return response.json();
    } else {
        throw new Error('Error. Response status is not 200.');
    };
};