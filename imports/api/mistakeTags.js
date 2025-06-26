export const getObjectTagsForList = (list) => {
  return list.map((value) => {
    return {
      value,
      label: findTag(value)?.label || value
    }
  }, [])
}

export const findTag = (value) => {
  return CHESS_MISTAKE_TAGS.find((tag) => tag.value === value)
}

export const findTagByLabel = (label) => {
  return CHESS_MISTAKE_TAGS.find((tag) => tag.label === label)
}

export const CHESS_MISTAKE_TAGS = [
  // Taktische Motive
  { value: 'fork', label: 'Fork' },
  { value: 'pin', label: 'Pin' },
  { value: 'skewer', label: 'Skewer' },
  { value: 'discovered-attack', label: 'Discovered Attack' },
  { value: 'double-attack', label: 'Double Attack' },
  { value: 'zwischenzug', label: 'Zwischenzug (Intermediate Move)' },
  { value: 'deflection', label: 'Deflection' },
  { value: 'removal-of-defender', label: 'Removal of the Defender' },
  { value: 'overload', label: 'Overload' },
  { value: 'back-rank-mate', label: 'Back Rank Mate' },
  { value: 'x-ray', label: 'X-ray' },
  { value: 'exposed-king', label: 'Exposed King'},

  // Strategische Themen
  { value: 'weak-square', label: 'Weak Square' },
  { value: 'bad-piece', label: 'Bad Piece' },
  { value: 'pawn-structure', label: 'Pawn Structure' },
  { value: 'king-safety', label: 'King Safety' },
  { value: 'space-advantage', label: 'Space Advantage' },
  { value: 'open-file', label: 'Open File' },
  { value: 'outpost', label: 'Outpost' },
  { value: 'weakness', label: 'Weakness' },
  { value: 'exchange', label: 'Exchange (wrong or missed)' },

  // Partiephase
  { value: 'opening', label: 'Opening' },
  { value: 'middlegame', label: 'Middlegame' },
  { value: 'endgame', label: 'Endgame' },

  // Fehlerart
  { value: 'calculation-error', label: 'Calculation Error' },
  { value: 'missed-tactic', label: 'Missed Tactic' },
  { value: 'blunder', label: 'Blunder (Hanging Piece)' },
  { value: 'positional-misjudgment', label: 'Positional Misjudgment' },
  { value: 'time-trouble', label: 'Time Trouble' },
  { value: 'not-following-plan', label: 'Not Following Plan' },

  // Zeitmanagement
  { value: 'too-fast', label: 'Too Fast' },
  { value: 'too-slow', label: 'Too Slow' },

  // Sonstiges / Custom
  { value: 'study', label: 'Study' },
  { value: 'blindspot', label: 'Blindspot' },
  { value: 'pattern-missed', label: 'Pattern Missed' },
  { value: 'emotional-mistake', label: 'Emotional Mistake (Tilt)' },
  { value: 'distraction', label: 'Distraction' }
];
