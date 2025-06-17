import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';

export const Mistakes = new Mongo.Collection('mistakes');

// SimpleSchema for validation
Mistakes.schema = new SimpleSchema({
  userId: { type: String },
  fen: { type: String },              // FEN string
  description: { type: String },       // Error description
  createdAt: { type: Date },
  nextReview: { type: Date },          // For Spaced Repetition
  interval: { type: Number, defaultValue: 1 }, // Days until next review
});

// Methods
Meteor.methods({
  async 'mistakes.insert'(fen, description) {
    if (!this.userId) throw new Meteor.Error('Not authorized');
    const now = new Date();
    await Mistakes.insertAsync({
      userId: this.userId,
      fen,
      description,
      createdAt: now,
      nextReview: now, // Review immediately
      interval: 1
    });
  },
  async 'mistakes.reviewed'(mistakeId, correct) {
    if (!this.userId) throw new Meteor.Error('Not authorized');
    const mistake = await Mistakes.findOneAsync({ _id: mistakeId, userId: this.userId });
    if (!mistake) throw new Meteor.Error('Not found');
    // Spaced repetition logic (simple Leitner)
    let newInterval = correct ? mistake.interval * 2 : 1;
    await Mistakes.updateAsync(mistakeId, {
      $set: {
        nextReview: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000),
        interval: newInterval
      }
    });

    console.log('reviewed succesfully', await Mistakes.findOneAsync({ _id: mistakeId }))
  },
  async 'mistakes.remove'(mistakeId) {
    if (!this.userId) throw new Meteor.Error('Not authorized');
    await Mistakes.removeAsync({ _id: mistakeId, userId: this.userId });
  }
});
