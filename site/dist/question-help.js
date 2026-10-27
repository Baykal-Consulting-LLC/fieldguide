// Response guidance only. These words do not change assessment items or scoring.
export function questionHelp(q,profession=false){
 if(profession)return q?.kind==='route'
  ?'Choose the education or training routes you would consider. You can choose more than one.'
  :'Choose the parts of this work you would like to try. You can choose more than one, or skip if none appeal to you.';
 if(q?.kind==='interest')return 'Imagine doing this activity. Choose how much you would enjoy it. Set aside skill, education, training, and pay.';
 if(q?.kind==='pathway')return 'Picture this as part of a normal workday. Choose how much it appeals to you.';
 if(q?.kind==='skill')return 'Choose the statement that best describes what you can do today. Skills can grow with practice.';
 if(q?.kind==='values')return 'Pick up to three things you most want from work. Tap a choice again to remove it.';
 if(q?.multi)return 'Choose any answers that fit you. Tap a choice again to remove it. You can skip if you are unsure.';
 return 'Choose the answer that best fits how you would like to work. Go with what feels closest to you.';
}
