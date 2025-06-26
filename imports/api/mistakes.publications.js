import { Meteor } from 'meteor/meteor';
import { Mistakes } from './mistakes.js';

Meteor.publish('mistakes.all', function () {
  if (!this.userId) return this.ready();
  return Mistakes.find({ userId: this.userId });
});

Meteor.publish('mistakes.due', function () {
  if (!this.userId) return this.ready();
  return Mistakes.find({ userId: this.userId, nextReview: { $lte: new Date() } });
});
