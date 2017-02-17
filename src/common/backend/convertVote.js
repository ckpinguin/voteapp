// This is used as a mapping function in votes.js
export default function convertVote(basicVote) {
    const totalVotes = basicVote.choices.reduce((prev, curr) =>
        prev + curr.count, 0);

    const convertedChoices = basicVote.choices.map((choice) => (
        {
            percent: choice.count * (100 / totalVotes) || 0,
            ...choice
        }));

    return {
        ...basicVote,
        totalVotes,
        choices: convertedChoices
    };
}
