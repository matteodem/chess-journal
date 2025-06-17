import { Meteor } from 'meteor/meteor';
import { Mistakes } from './mistakes.js';

Meteor.publish('mistakes', function () {
  if (!this.userId) return this.ready();
  return Mistakes.find({ userId: this.userId });
});
