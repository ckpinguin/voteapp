export default JSON.parse(`{
    "id" : "vote_1",
    "user" : "Peter",
    "title" : "How is your day?",
    "description" : "Tell me: how has your day been so far?",
    "totalVotes": 100,
    "choices" : [
        {
            "percent": 70,
            "id": "choice_1",
            "title": "Good",
            "count": 70,
        }, {
            "id": "choice_2",
            "title": "Bad",
            "count": 25,
            "percent": 25
        }, {
            "percent": 5,
            "id": "choice_3",
            "title": "Not sure yet",
            "count": 5
        }
    ]
}`);
