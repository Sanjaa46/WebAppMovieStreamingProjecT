const fetch = require('node-fetch');

async function fetchData() {
    try {
        const response = await fetch('https://api.jsonbin.io/v3/b/6645bc42e41b4d34e4f48a87', {
            headers: {
                'X-Master-Key': '$2a$10$BJUFCfND/qIuzfSFZNANRuEiGlTBb3Hp7Z1TSUBfz5GsbE7OSr8.K',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = fetchData;
