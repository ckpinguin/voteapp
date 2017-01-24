import React from 'react';
import styles from './styles.styl';
import { guid, dd } from '../shared/toolbox';

/**
* Helper, creates an empty choice object
*/
function emptyChoice() {
    const uuid = guid();
    dd(uuid, 'uuid','emptyChoice()');
    return {
        id:     `choice_${uuid}`,
        count:  0,
        title:  null
    };
}

/**
* Helper, creates an empty vote object
*/
function emptyVote() {
    const uuid = guid();
    dd(uuid, 'uuid', 'emptyVote()');
    return {
        title:          '',
        description:    '',
        formCompleted:  false,
        choices:        [emptyChoice()]
    };
}

export default class VoteComposer extends React.Component {
    /**
    * @constructs VoteComposer
    * @param {Object} props - props with 'active' flag,'onActivate',
    * 'onDeactivate' and 'onSave' event handlers
    */
    constructor(props) {
        super(props);

        this.state = {
            vote: emptyVote()
        };
        dd(this.state, 'this.state','VoteComposer.construtor()');

        this.activateIfNeeded = this.activateIfNeeded.bind(this);
        this.save = this.save.bind(this);
        this.close = this.close.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onChoiceChange = this.onChoiceChange.bind(this);
    }

    /**
    * Helper, closes the active form.
    */
    close() {
        const { onDeactivate } = this.props;
        dd(onDeactivate, 'onDeactivate', 'close()');
        this.setState({ vote: emptyVote() }); // BUG?
        dd(this.state, 'this.state');
        onDeactivate();
    }

    /**
    * Helper, saves and closes the new vote form.
    */
    save() {
        const { onSave } = this.props;
        const { vote } = this.state;
        const newVote = {
            ...vote,
            // get rid of the empty choice from our "pool"
            choices: vote.choices.slice(0, -1)
        };
        dd(newVote, 'newVote', 'VoteComposer.save()');
        onSave(newVote);
        this.close();
    }

    /**
    * Helper, activates the composer form
    */
    activateIfNeeded() {
        const { onActivate, active } = this.props;
        dd(onActivate, 'onActivate', 'activateIfNeeded()');
        if (!active) {
            onActivate();
        }
    }

    /**
    * Helper, decides if the voting form is sufficiently filled
    * @returns {boolean}
    */
    isFormCompleted() {
        const { active } = this.props;
        const { vote: { title, description, choices } } = this.state;
        const choicesCount = choices.length;

        let formCompleted =
            active && title && description && choicesCount > 1;

        dd(formCompleted, 'formCompleted', 'isFormCompleted()');


        if (formCompleted) {
            // if all (except the last empty one) choices are filled
            // the form is complete
            formCompleted = choices.every(
                (c, ix) => ix === choicesCount - 1 || c.title
            );
        }
        return formCompleted;
    }

    /**
    * Event handler, copies the current vote object and adds a new
    * field name/value to it then sets current state object 'vote'
    * to this new object
    * @param {Object} event
    */
    onChange(event) {
        const { name: fieldName, value: fieldValue } = event.target;
        const { vote } = this.state;
        // copy the existing vote
        const newVote = {
            ...vote,
            // ES6 "computed property" as the fieldName will be the choice item
            [fieldName]: fieldValue
        };
        dd(newVote, 'newVote', 'onChange()');
        this.setState({
            vote: newVote
        });
        dd(this.state, 'this.state');

    }

    /**
    * Event handler, creates a new choice option in the corresponding choice object and
    * then replaces the corresponding choice object in the current vote
    * object (state).
    * @param {number} choiceIx - the index of the changed choice
    * @param {string} title - the new title of the changed choice
    */
    onChoiceChange(choiceIx, title) {
        const { vote } = this.state;
        const choices = vote.choices;
        const choice = choices[choiceIx];

        const newChoice = {
            ...choice,
            title
        };

        const newChoices =
            choices.map((c) => (c.id === choice.id ? newChoice : c));

        dd(newChoices, 'newChoices', 'onChoiceChange()');
        // add a new, empty choice field if we're currently in the last choice and the choice
        // has been new (empty) before. In other words: after entering the first character to the current last
        // choice add the field for the next choice
        if (!choice.title && newChoice.title
                && choiceIx === (choices.length -1)) {
            newChoices.push(emptyChoice());
        }

        this.setState({
            vote: {
                ...vote,
                choices: newChoices
            }
        });
        dd(this.state, 'this.state');
    }

    /**
    * Helper, that renders the inactive form
    */
    renderInactiveForm() {
        dd(null, null, 'renderInactiveForm()');
        return (
            <div className={[styles.row, styles.voteComposer, styles.spacer].join(' ')}
                onClick={this.activateIfNeeded}>
                <h1 className={styles.title}>
                    <span className={styles.emphasis}>
                        What do <b>you</b> want to know?
                    </span>
                    <div className={styles.badge}>Add voting</div>
                </h1>
                <p>Click here to leave your own question.</p>
            </div>
        );
    }

    /**
    * Helper, that renders the active form
    */
    renderActiveForm() {
        const { vote: { title, description, choices }} = this.state;
        const formCompleted = this.isFormCompleted();

        dd(null, null, 'renderActiveForm()');

        return (
            <div className={[styles.row, styles.voteComposer, styles.spacer].join(' ')}>
                <div className={styles.head}>
                    <h1 className={styles.title}>
                        <input  className={styles.title}
                                autoFocus
                                name="title"
                                type="text"
                                placeholder="What do you want to know?"
                                value={title}
                                onChange={this.onChange}/>
                    </h1>
                    <input  className={styles.description}
                            name="description"
                            type="text"
                            placeholder="Describe your question in one sentence here"
                            value={description}
                            onChange={this.onChange}/>
                </div>
                <div className={styles.composeBody}>
                    {choices.map((c, ix) => {
                        const keyAndName = `choices_${ix}`;
                        return (
                            <input  className={styles.choice}
                                    type="text"
                                    key={keyAndName}
                                    name={keyAndName}
                                    placeholder={`Choice #${(ix + 1)}`}
                                    onChange={
                                        (event)=>{this.onChoiceChange(ix, event.target.value);}}
                            />
                        );
                    })}
                    <div className={styles.buttonBar}>
                        <a className={formCompleted ? styles.button :
                            (styles.button + ' ' + styles.disabled)}
                            onClick={formCompleted ? this.save : null}>Save</a>
                        <a className={styles.button} onClick={this.close}>Cancel</a>
                    </div>
                </div>
            </div>
        );
    }

    /**
    * Renders the active or inactive form upon the props.active boolean
    */
    render() {
        const {active} = this.props;
        if (!active) {
            return this.renderInactiveForm();
        }
        return this.renderActiveForm();
    }
}

VoteComposer.propTypes = {
    active:         React.PropTypes.bool,
    onSave:         React.PropTypes.func.isRequired,
    onActivate:     React.PropTypes.func.isRequired,
    onDeactivate:   React.PropTypes.func.isRequired
};
