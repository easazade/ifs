export type Trait = {
  name: string;
  level: "low" | "medium" | "high";
  effect: string;
  valence: "negative" | "positive";
};

export const traitPool: Trait[] = [
  {
    name: "sociability",
    level: "medium",
    effect:
      "Comfortable joining familiar groups and conversations, but still needs time alone to recharge.",
    valence: "positive",
  },
  {
    name: "diligence",
    level: "high",
    effect:
      "Follows through on responsibilities and examines important details before committing.",
    valence: "positive",
  },
  {
    name: "courage",
    level: "medium",
    effect:
      "Can face difficult conversations and risks when the stakes are meaningful, though fear may still slow action.",
    valence: "positive",
  },
  {
    name: "compassion",
    level: "high",
    effect:
      "Gives substantial weight to other people's suffering, including people outside their own circle.",
    valence: "positive",
  },
  {
    name: "curiosity",
    level: "high",
    effect:
      "Actively seeks new information, asks questions, and is drawn to unfamiliar ideas.",
    valence: "positive",
  },
  {
    name: "patience",
    level: "medium",
    effect:
      "Can tolerate ordinary delays and listen before reacting, but may become restless under repeated pressure.",
    valence: "positive",
  },
  {
    name: "self-discipline",
    level: "high",
    effect:
      "Can keep working toward a chosen goal even when comfort, distraction, or immediate pleasure compete for attention.",
    valence: "positive",
  },
  {
    name: "reliability",
    level: "high",
    effect:
      "Keeps commitments, arrives prepared, and takes promises seriously unless circumstances make them impossible.",
    valence: "positive",
  },
  {
    name: "honesty",
    level: "high",
    effect:
      "Usually tells the truth and resists misleading others, even when a lie would be convenient.",
    valence: "positive",
  },
  {
    name: "fairness",
    level: "high",
    effect:
      "Looks for consistent rules and objects when people receive unequal treatment without a good reason.",
    valence: "positive",
  },
  {
    name: "generosity",
    level: "medium",
    effect:
      "Readily shares time, help, or resources when the cost feels manageable and the need seems real.",
    valence: "positive",
  },
  {
    name: "gratitude",
    level: "medium",
    effect:
      "Notices help and good fortune, and tends to respond with appreciation rather than entitlement.",
    valence: "positive",
  },
  {
    name: "humility",
    level: "medium",
    effect:
      "Can admit limits and mistakes, though may still defend an opinion they care deeply about.",
    valence: "positive",
  },
  {
    name: "adaptability",
    level: "high",
    effect:
      "Adjusts plans quickly when circumstances change and can function without familiar routines.",
    valence: "positive",
  },
  {
    name: "resilience",
    level: "high",
    effect:
      "Recovers from setbacks and continues trying after disappointment, criticism, or failure.",
    valence: "positive",
  },
  {
    name: "optimism",
    level: "medium",
    effect:
      "Usually expects that problems can improve with effort, while still recognizing genuine risks.",
    valence: "positive",
  },
  {
    name: "prudence",
    level: "high",
    effect:
      "Considers long-term consequences and avoids unnecessary risks before making a significant choice.",
    valence: "positive",
  },
  {
    name: "open-mindedness",
    level: "high",
    effect:
      "Can seriously consider views that differ from their own and revise a belief when evidence is strong.",
    valence: "positive",
  },
  {
    name: "self-awareness",
    level: "high",
    effect:
      "Usually recognizes their own emotions, motives, and recurring weaknesses before they control a decision.",
    valence: "positive",
  },
  {
    name: "emotional-regulation",
    level: "high",
    effect:
      "Can pause, name strong feelings, and choose a response instead of immediately acting on anger or fear.",
    valence: "positive",
  },
  {
    name: "empathy",
    level: "high",
    effect:
      "Can imagine how a decision may feel from another person's position and incorporates that perspective.",
    valence: "positive",
  },
  {
    name: "assertiveness",
    level: "medium",
    effect:
      "States needs and disagreements clearly without usually becoming aggressive or withdrawing.",
    valence: "positive",
  },
  {
    name: "cooperativeness",
    level: "high",
    effect:
      "Looks for workable compromises and contributes to shared goals rather than treating every issue as a contest.",
    valence: "positive",
  },
  {
    name: "loyalty",
    level: "high",
    effect:
      "Stays committed to trusted people and groups, especially when they are facing difficulty.",
    valence: "positive",
  },
  {
    name: "forgiveness",
    level: "medium",
    effect:
      "Can let go of many hurts after sincere repair, though serious betrayal remains difficult to forget.",
    valence: "positive",
  },
  {
    name: "responsibility",
    level: "high",
    effect:
      "Feels personally accountable for duties and for repairing harm they caused.",
    valence: "positive",
  },
  {
    name: "initiative",
    level: "medium",
    effect:
      "Will often begin useful work or raise a problem without waiting for someone else to take charge.",
    valence: "positive",
  },
  {
    name: "creativity",
    level: "high",
    effect:
      "Generates unusual possibilities and enjoys finding original routes around a problem.",
    valence: "positive",
  },
  {
    name: "attentiveness",
    level: "high",
    effect:
      "Notices relevant details, changes in mood, and small inconsistencies that others may miss.",
    valence: "positive",
  },
  {
    name: "practical-wisdom",
    level: "medium",
    effect:
      "Balances ideals with real-world constraints and tends to ask what will work in this specific situation.",
    valence: "positive",
  },
  {
    name: "integrity",
    level: "high",
    effect:
      "Tries to act consistently with stated principles even when no one is watching.",
    valence: "positive",
  },
  {
    name: "kindness",
    level: "high",
    effect:
      "Tends to treat people gently and offers small acts of care without needing a personal advantage.",
    valence: "positive",
  },
  {
    name: "perseverance",
    level: "high",
    effect:
      "Keeps pursuing demanding goals through boredom, obstacles, and repeated unsuccessful attempts.",
    valence: "positive",
  },
  {
    name: "confidence",
    level: "medium",
    effect:
      "Usually trusts their ability to handle ordinary challenges, but may hesitate in unfamiliar high-stakes situations.",
    valence: "positive",
  },
  {
    name: "independence",
    level: "medium",
    effect:
      "Can form and act on personal judgments without needing constant approval from others.",
    valence: "positive",
  },
  {
    name: "discretion",
    level: "high",
    effect:
      "Handles private information carefully and considers when speaking openly could create needless harm.",
    valence: "positive",
  },
  {
    name: "respectfulness",
    level: "high",
    effect:
      "Treats people with basic dignity, including people with less power or status.",
    valence: "positive",
  },
  {
    name: "learning-agility",
    level: "high",
    effect:
      "Learns quickly from feedback and can apply a lesson from one situation to another.",
    valence: "positive",
  },
  {
    name: "tact",
    level: "medium",
    effect:
      "Can express difficult truths in a way that preserves another person's dignity, though not perfectly under stress.",
    valence: "positive",
  },
  {
    name: "future-orientation",
    level: "high",
    effect:
      "Gives strong weight to long-term consequences instead of focusing only on immediate rewards.",
    valence: "positive",
  },
  {
    name: "resourcefulness",
    level: "high",
    effect:
      "Finds useful people, tools, and alternatives when the obvious solution is unavailable.",
    valence: "positive",
  },
  {
    name: "leadership",
    level: "medium",
    effect:
      "Can coordinate others and give direction when needed, while still making room for other voices.",
    valence: "positive",
  },
  {
    name: "playfulness",
    level: "medium",
    effect:
      "Brings lightness and humor into ordinary situations and can reduce tension without ignoring serious issues.",
    valence: "positive",
  },
  {
    name: "civic-mindedness",
    level: "high",
    effect:
      "Considers the health of the wider group and supports duties that benefit people beyond close friends.",
    valence: "positive",
  },
  {
    name: "decisiveness",
    level: "medium",
    effect:
      "Can make a timely choice with incomplete information, while still consulting others on major matters.",
    valence: "positive",
  },
  {
    name: "tolerance",
    level: "high",
    effect:
      "Can coexist with people whose beliefs, background, or lifestyle differ from their own.",
    valence: "positive",
  },
  {
    name: "self-respect",
    level: "high",
    effect:
      "Protects personal boundaries and is less likely to accept humiliation or exploitation for approval.",
    valence: "positive",
  },
  {
    name: "hopefulness",
    level: "medium",
    effect:
      "Maintains a sense that meaningful improvement is possible, especially when people act together.",
    valence: "positive",
  },
  {
    name: "carefulness",
    level: "high",
    effect:
      "Checks important facts and avoids acting carelessly when a mistake could affect other people.",
    valence: "positive",
  },
  {
    name: "moral-conviction",
    level: "medium",
    effect:
      "Is willing to defend core ethical commitments even when doing so costs comfort or popularity.",
    valence: "positive",
  },

  {
    name: "impulsiveness",
    level: "medium",
    effect:
      "May act quickly when excited, angry, or tempted, then reconsider after consequences become clearer.",
    valence: "negative",
  },
  {
    name: "procrastination",
    level: "medium",
    effect:
      "Delays unpleasant or demanding tasks even when the delay creates later pressure.",
    valence: "negative",
  },
  {
    name: "conflict-avoidance",
    level: "high",
    effect:
      "Avoids confrontation and may stay silent or agree outwardly to escape interpersonal tension.",
    valence: "negative",
  },
  {
    name: "selfishness",
    level: "low",
    effect:
      "Usually considers others, but may prioritize personal convenience when the cost to others seems distant or small.",
    valence: "negative",
  },
  {
    name: "greed",
    level: "medium",
    effect:
      "Places a strong weight on gaining or keeping money, status, or resources, sometimes at others' expense.",
    valence: "negative",
  },
  {
    name: "deceitfulness",
    level: "low",
    effect:
      "May conceal or distort facts when honesty threatens a valued outcome, though this is not a default habit.",
    valence: "negative",
  },
  {
    name: "vindictiveness",
    level: "low",
    effect:
      "Can feel drawn to make someone pay after a perceived wrong, especially when they believe formal justice failed.",
    valence: "negative",
  },
  {
    name: "jealousy",
    level: "medium",
    effect:
      "Feels threatened by a close person's attention, affection, or loyalty toward someone else.",
    valence: "negative",
  },
  {
    name: "envy",
    level: "medium",
    effect:
      "Compares themselves with better-off people and may resent advantages they believe are undeserved.",
    valence: "negative",
  },
  {
    name: "arrogance",
    level: "low",
    effect:
      "Can overestimate their own judgment or treat less experienced people as having little to offer.",
    valence: "negative",
  },
  {
    name: "stubbornness",
    level: "medium",
    effect:
      "Has difficulty changing course after taking a position, even when new information weakens it.",
    valence: "negative",
  },
  {
    name: "suspiciousness",
    level: "medium",
    effect:
      "Tends to look for hidden motives and may withhold trust until others repeatedly prove themselves.",
    valence: "negative",
  },
  {
    name: "callousness",
    level: "low",
    effect:
      "Can discount another person's emotional pain when it conflicts with a desired outcome.",
    valence: "negative",
  },
  {
    name: "laziness",
    level: "medium",
    effect:
      "Avoids effort when there is no immediate pressure and may leave necessary work for others.",
    valence: "negative",
  },
  {
    name: "recklessness",
    level: "low",
    effect:
      "Sometimes underestimates danger or consequences in pursuit of excitement, speed, or a quick gain.",
    valence: "negative",
  },
  {
    name: "gullibility",
    level: "low",
    effect:
      "May accept confident claims or emotionally persuasive stories without enough verification.",
    valence: "negative",
  },
  {
    name: "pessimism",
    level: "low",
    effect:
      "Can expect disappointing outcomes and may hesitate to support a plan because failure feels likely.",
    valence: "negative",
  },
  {
    name: "irritability",
    level: "medium",
    effect:
      "Becomes annoyed quickly under inconvenience, fatigue, or criticism and may respond more sharply than intended.",
    valence: "negative",
  },
  {
    name: "defensiveness",
    level: "medium",
    effect:
      "Interprets criticism as a personal attack and may explain, deny, or counterattack before reflecting.",
    valence: "negative",
  },
  {
    name: "resentment",
    level: "low",
    effect:
      "Holds onto perceived unfairness and may let old injuries shape later judgments of the people involved.",
    valence: "negative",
  },
  {
    name: "neediness",
    level: "medium",
    effect:
      "Seeks reassurance and closeness intensely, which can make rejection or delayed replies feel unusually painful.",
    valence: "negative",
  },
  {
    name: "people-pleasing",
    level: "high",
    effect:
      "Prioritizes approval and harmony so strongly that they may suppress needs, boundaries, or honest disagreement.",
    valence: "negative",
  },
  {
    name: "social-withdrawal",
    level: "medium",
    effect:
      "Pulls back from groups and difficult conversations, reducing access to support and differing views.",
    valence: "negative",
  },
  {
    name: "attention-seeking",
    level: "low",
    effect:
      "May amplify stories or behaviors to receive notice, affirmation, or social importance.",
    valence: "negative",
  },
  {
    name: "dominance-seeking",
    level: "medium",
    effect:
      "Prefers to control group decisions and may treat disagreement as a challenge to personal standing.",
    valence: "negative",
  },
  {
    name: "status-obsession",
    level: "low",
    effect:
      "Gives excessive weight to prestige, rank, and how choices will affect others' view of them.",
    valence: "negative",
  },
  {
    name: "perfectionism",
    level: "medium",
    effect:
      "Sets unrealistically exact standards and may delay, overwork, or criticize others when normal flaws appear.",
    valence: "negative",
  },
  {
    name: "control-need",
    level: "high",
    effect:
      "Finds uncertainty difficult and may micromanage people or resist plans they cannot personally direct.",
    valence: "negative",
  },
  {
    name: "emotional-volatility",
    level: "medium",
    effect:
      "Experiences emotional shifts intensely, making mood more likely to influence communication and judgment.",
    valence: "negative",
  },
  {
    name: "avoidance",
    level: "medium",
    effect:
      "Moves away from situations that could bring discomfort, failure, or painful feelings, even when engagement would help.",
    valence: "negative",
  },
  {
    name: "fatalism",
    level: "low",
    effect:
      "May assume that personal effort cannot change important outcomes and therefore invest less in action.",
    valence: "negative",
  },
  {
    name: "cynicism",
    level: "medium",
    effect:
      "Assumes people and institutions are mainly self-serving, which can block trust and cooperation.",
    valence: "negative",
  },
  {
    name: "self-righteousness",
    level: "low",
    effect:
      "Treats their own moral view as obviously superior and may dismiss sincere disagreement too quickly.",
    valence: "negative",
  },
  {
    name: "intolerance",
    level: "medium",
    effect:
      "Has difficulty accepting beliefs or ways of life that conflict strongly with their own standards.",
    valence: "negative",
  },
  {
    name: "rash-judgment",
    level: "low",
    effect:
      "Forms conclusions about people or situations from limited information and may resist revisiting them.",
    valence: "negative",
  },
  {
    name: "rigidity",
    level: "medium",
    effect:
      "Relies heavily on familiar rules and routines and struggles when a situation demands flexibility.",
    valence: "negative",
  },
  {
    name: "indecisiveness",
    level: "medium",
    effect:
      "Has trouble choosing between options and may keep seeking certainty after a decision is needed.",
    valence: "negative",
  },
  {
    name: "passivity",
    level: "high",
    effect:
      "Waits for others to act and may accept an unwanted direction rather than trying to influence it.",
    valence: "negative",
  },
  {
    name: "manipulativeness",
    level: "low",
    effect:
      "May use guilt, selective information, or emotional pressure to influence people without asking directly.",
    valence: "negative",
  },
  {
    name: "opportunism",
    level: "medium",
    effect:
      "Changes alliances or positions readily when doing so offers a personal advantage.",
    valence: "negative",
  },
  {
    name: "disloyalty",
    level: "low",
    effect:
      "May abandon commitments or reveal confidences when loyalty becomes costly or inconvenient.",
    valence: "negative",
  },
  {
    name: "cruelty",
    level: "low",
    effect:
      "Can take satisfaction in another person's humiliation or pain, particularly when angry or seeking power.",
    valence: "negative",
  },
  {
    name: "sexual-impulsivity",
    level: "low",
    effect:
      "May pursue sexual attention or gratification without fully weighing consent, commitments, or later consequences.",
    valence: "negative",
  },
  {
    name: "materialism",
    level: "medium",
    effect:
      "Ties success and self-worth strongly to possessions, income, and visible signs of wealth.",
    valence: "negative",
  },
  {
    name: "spitefulness",
    level: "low",
    effect:
      "May accept a cost to themselves if it also prevents someone they resent from benefiting.",
    valence: "negative",
  },
  {
    name: "paranoia",
    level: "low",
    effect:
      "May read ordinary ambiguity as evidence of hostile intent and react with defensive distrust.",
    valence: "negative",
  },
  {
    name: "insecurity",
    level: "high",
    effect:
      "Doubts their own worth and may react strongly to comparison, criticism, or possible rejection.",
    valence: "negative",
  },
  {
    name: "apathy",
    level: "medium",
    effect:
      "Shows limited interest in problems that do not affect them directly and may disengage from shared responsibilities.",
    valence: "negative",
  },
  {
    name: "blame-shifting",
    level: "medium",
    effect:
      "Protects self-image by emphasizing others' faults or circumstances when their own choices caused a problem.",
    valence: "negative",
  },
  {
    name: "complacency",
    level: "medium",
    effect:
      "Becomes satisfied with an adequate situation and may resist effort or change even when improvement is needed.",
    valence: "negative",
  },
];
