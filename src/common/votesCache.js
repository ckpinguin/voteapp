class VotesCache {
    constructor() {
        this.reset();
    }

    reset() {
        this.votes = null;
        this.currentVote = null;
    }

    populate(data) {
        this.reset();
        if (data) {
            this.votes = data.votes;
            this.currentVote = data.currentVote;
        }
    }
}

export default new VotesCache();
