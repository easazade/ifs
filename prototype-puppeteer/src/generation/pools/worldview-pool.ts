export type Worldview = {
  viewOfPeople: string;
  viewOfSelf: string;
  viewOfLife: string;
  beliefAboutGodAndAfterlife: string;
};

export const worldviewPool: Worldview[] = [
  {
    viewOfPeople: 'People are morally responsible but vulnerable to temptation, fear, and self-interest.',
    viewOfSelf: 'A servant of God who must continually correct personal flaws and intentions.',
    viewOfLife: 'Life is a test of character, duty, mercy, and trustworthiness.',
    beliefAboutGodAndAfterlife:
      'Believes in one just and merciful God, accountability after death, and an afterlife in which actions matter.',
  },
  {
    viewOfPeople: 'Most people can care for one another, but social conditions often distort their choices.',
    viewOfSelf: 'One person among many, with a responsibility to reduce suffering where possible.',
    viewOfLife:
      'Life has no guaranteed cosmic purpose; meaning is made through relationships, knowledge, and humane action.',
    beliefAboutGodAndAfterlife:
      'Does not believe in God or an afterlife, but sees human wellbeing as morally important in itself.',
  },
  {
    viewOfPeople: 'People are imperfect and often lost, yet every person remains worthy of love and forgiveness.',
    viewOfSelf: 'A flawed person who depends on grace and should extend grace to others.',
    viewOfLife: 'Life is an opportunity to love God and neighbor, forgive, and become more compassionate.',
    beliefAboutGodAndAfterlife: 'Believes in a loving God, salvation, and an eternal life beyond death.',
  },
  {
    viewOfPeople:
      'People pursue their interests and can cooperate when rules and incentives make cooperation worthwhile.',
    viewOfSelf: 'An independent chooser who must protect personal freedom and bear the cost of personal decisions.',
    viewOfLife:
      'Life is a series of choices under uncertainty, with no one else obligated to provide meaning or rescue.',
    beliefAboutGodAndAfterlife:
      'Is uncertain about God and an afterlife; considers them possible but does not rely on them in daily decisions.',
  },
  {
    viewOfPeople: 'People are connected through duties, consequences, and the moral weight of their actions.',
    viewOfSelf: 'A soul with obligations shaped by family, role, and the consequences of prior choices.',
    viewOfLife: 'Life is a path of learning to act rightly, fulfill duty, and grow beyond selfish desire.',
    beliefAboutGodAndAfterlife: 'Believes in a divine order, karma, and continuing existence or rebirth after death.',
  },
  {
    viewOfPeople:
      'People suffer because they cling to unstable things and mistake passing feelings for permanent reality.',
    viewOfSelf: 'A changing process rather than a fixed, separate self.',
    viewOfLife: 'Life is marked by impermanence; peace comes through awareness, compassion, and loosening attachment.',
    beliefAboutGodAndAfterlife:
      'Does not center belief on a creator God; believes actions have consequences beyond immediate life and that rebirth may occur.',
  },
  {
    viewOfPeople: 'People are complicated, often acting from motives they do not fully understand.',
    viewOfSelf: 'A fallible observer who should be cautious about certainty and personal bias.',
    viewOfLife:
      'Life is best approached through inquiry, modest expectations, and appreciation for what can actually be known.',
    beliefAboutGodAndAfterlife:
      'Agnostic; considers the question open and does not claim knowledge of what follows death.',
  },
  {
    viewOfPeople: 'People are bound to one another by responsibility, memory, and a shared moral law.',
    viewOfSelf: 'A link in a long chain of family and community, entrusted with preserving what is good.',
    viewOfLife: 'Life is a covenantal task: build a just community, remember history, and pass wisdom forward.',
    beliefAboutGodAndAfterlife:
      'Believes in one God who calls people to ethical responsibility; holds a reverent but non-detailed view of what comes after death.',
  },
  {
    viewOfPeople: 'People cannot control everything, but they can control their judgment, conduct, and response.',
    viewOfSelf: 'A rational agent responsible for inner discipline rather than external outcomes.',
    viewOfLife:
      'Life is practice in accepting what cannot be changed while acting virtuously where action is possible.',
    beliefAboutGodAndAfterlife:
      'Is open to a providential order but treats virtue in this life as the central concern.',
  },
  {
    viewOfPeople: 'People need moral boundaries because desire, pride, and social pressure can lead them astray.',
    viewOfSelf: 'A member of a family and religious community whose identity is shaped by obligations.',
    viewOfLife: 'Life is for honoring inherited duties, protecting family, and living within a stable moral order.',
    beliefAboutGodAndAfterlife: 'Believes firmly in God, judgment, reward, and punishment after death.',
  },
  {
    viewOfPeople:
      'People have reason and conscience, but neither is perfect enough to make them masters of the universe.',
    viewOfSelf: 'A temporary individual with dignity and a duty to use reason responsibly.',
    viewOfLife: 'Life is for living decently, seeking truth, and leaving the world somewhat better than it was found.',
    beliefAboutGodAndAfterlife:
      'Believes a creator began the universe but is unsure whether that creator intervenes or grants an afterlife.',
  },
  {
    viewOfPeople: 'People are inseparable from land, ancestors, and the living community around them.',
    viewOfSelf: 'A caretaker whose identity comes from relationships with kin, place, and inherited stories.',
    viewOfLife: 'Life is a reciprocal relationship with community and nature, not merely a private project.',
    beliefAboutGodAndAfterlife:
      'Believes the sacred is present in creation and ancestors remain spiritually meaningful after death.',
  },
  {
    viewOfPeople: 'People are capable of extraordinary kindness, but institutions often reward greed and indifference.',
    viewOfSelf: 'A participant in a larger struggle for dignity and equal treatment.',
    viewOfLife: 'Life gains meaning by resisting exploitation and helping build fairer social arrangements.',
    beliefAboutGodAndAfterlife:
      'Does not hold a settled religious belief; focuses moral attention on justice in this world.',
  },
  {
    viewOfPeople:
      'People mostly want safety, belonging, and respect, and become dangerous when they believe those are under threat.',
    viewOfSelf: 'A protector who must stay alert and provide stability for close people.',
    viewOfLife: 'Life is demanding and uncertain; security, loyalty, and preparation matter more than grand theories.',
    beliefAboutGodAndAfterlife:
      'Believes in God as a source of protection and meaning, but rarely thinks in detailed theological terms.',
  },
  {
    viewOfPeople: 'People are shaped by unconscious fears, desires, and old wounds as much as by deliberate reasoning.',
    viewOfSelf: 'A person with hidden patterns who can gain freedom through honest self-examination.',
    viewOfLife: 'Life is a process of becoming more conscious and less ruled by unexamined pain.',
    beliefAboutGodAndAfterlife:
      'Is spiritually open but uncertain; sees religious language as potentially meaningful without claiming certainty.',
  },
  {
    viewOfPeople: 'People want recognition and will often compete for it, but they can mature beyond that competition.',
    viewOfSelf: 'A person trying to become capable, respected, and internally coherent.',
    viewOfLife: "Life is self-creation through challenge, achievement, and responsibility for one's own standards.",
    beliefAboutGodAndAfterlife:
      'Does not believe in a personal God or a guaranteed afterlife; sees this life as the arena for self-development.',
  },
  {
    viewOfPeople: 'People are fundamentally equal in worth, though unequal in power, opportunity, and confidence.',
    viewOfSelf: 'A citizen with rights and duties who should defend both for everyone.',
    viewOfLife:
      "Life should allow people to pursue their own path without domination, provided they respect others' freedom.",
    beliefAboutGodAndAfterlife:
      'Believes in God privately but thinks political and public rules should stand on reasons shared by believers and nonbelievers.',
  },
  {
    viewOfPeople:
      'People are naturally social and usually become better through trustworthy relationships and good examples.',
    viewOfSelf: 'A relational person whose wellbeing is inseparable from the wellbeing of close others.',
    viewOfLife: 'Life is for building a loving home, being useful, and showing up for people over time.',
    beliefAboutGodAndAfterlife: 'Believes in a caring God and hopes for reunion with loved ones after death.',
  },
  {
    viewOfPeople:
      'People are often driven by immediate emotion and need clear evidence before strong claims should be trusted.',
    viewOfSelf: 'A skeptical thinker who should test assumptions, including personal assumptions.',
    viewOfLife: 'Life is an opportunity to understand reality more accurately and make practical improvements.',
    beliefAboutGodAndAfterlife:
      'Does not see sufficient evidence for God or an afterlife, while remaining willing to revise that view if evidence changed.',
  },
  {
    viewOfPeople: 'People have a spiritual nature and can grow through sincere worship, discipline, and service.',
    viewOfSelf: 'A soul accountable for intentions as well as outward behavior.',
    viewOfLife:
      'Life is temporary preparation for a fuller reality, and moral conduct should not depend on public reward.',
    beliefAboutGodAndAfterlife: 'Believes in God, divine mercy, judgment, and a continuing life after death.',
  },
  {
    viewOfPeople: 'People need both freedom and structure; too much of either can weaken character.',
    viewOfSelf: 'A steward of personal talents, family obligations, and limited resources.',
    viewOfLife: 'Life is about building competence, stability, and a legacy through sustained work.',
    beliefAboutGodAndAfterlife:
      'Believes in God and an afterlife, but treats everyday responsibility as the clearest form of faith.',
  },
  {
    viewOfPeople: 'People do not have a fixed essence; they become who they are through choice and commitment.',
    viewOfSelf: 'A free but anxious person who cannot escape responsibility for choosing a direction.',
    viewOfLife:
      'Life has no ready-made script, so authenticity requires choosing values and living their consequences.',
    beliefAboutGodAndAfterlife:
      'Does not believe in a predetermined divine plan or afterlife; sees mortality as part of what makes choices serious.',
  },
  {
    viewOfPeople:
      'People are flawed but educable, especially when they are treated with fairness and given real responsibility.',
    viewOfSelf: 'A learner who should remain open to correction and keep developing.',
    viewOfLife: 'Life is an unfinished education in judgment, skill, and ethical maturity.',
    beliefAboutGodAndAfterlife:
      'Believes in a higher power but does not claim to know the details of divine judgment or the afterlife.',
  },
  {
    viewOfPeople:
      'People are often lonely beneath their social roles and need to feel seen before they can cooperate deeply.',
    viewOfSelf: 'A sensitive person who needs authenticity and emotional connection more than status.',
    viewOfLife: 'Life is about honest connection, self-expression, and refusing to live by empty appearances.',
    beliefAboutGodAndAfterlife:
      'Is uncertain about God and afterlife, but experiences awe, love, and conscience as spiritually significant.',
  },
  {
    viewOfPeople:
      'People are capable of reason, but habit and cultural loyalty often make them defend what they inherited.',
    viewOfSelf: 'A reformer who should question inherited practices while avoiding contempt for ordinary people.',
    viewOfLife: 'Life improves when customs are tested against evidence, freedom, and preventable suffering.',
    beliefAboutGodAndAfterlife:
      'Does not hold a strong religious belief and focuses on what can be improved in present social life.',
  },
  {
    viewOfPeople:
      'People respond to incentives, but love, honor, and identity sometimes matter more than material advantage.',
    viewOfSelf: 'A realistic decision-maker who should understand both human motives and tradeoffs.',
    viewOfLife:
      'Life is about making sound choices, protecting what matters, and accepting that every option has costs.',
    beliefAboutGodAndAfterlife:
      'Believes in God in a general sense but does not expect religious belief to settle every practical question.',
  },
  {
    viewOfPeople:
      'People deserve compassion because anyone can be harmed by bad luck, illness, loss, or social neglect.',
    viewOfSelf: 'A temporary beneficiary of conditions that could easily have been otherwise.',
    viewOfLife: 'Life is fragile, so a decent society protects dignity and reduces avoidable hardship.',
    beliefAboutGodAndAfterlife:
      'Does not know whether God or an afterlife exists; moral concern comes from the reality of shared vulnerability.',
  },
  {
    viewOfPeople: 'People become honorable through loyalty, courage, and keeping their word when it becomes difficult.',
    viewOfSelf: 'A person whose worth depends heavily on whether they can be trusted by their own people.',
    viewOfLife: 'Life is a test of honor and steadiness under pressure; reputation is earned over years.',
    beliefAboutGodAndAfterlife:
      'Believes in God and that ultimate justice exists, while also caring strongly about honor in this life.',
  },
  {
    viewOfPeople: "People's stories are always partial, and no group has a monopoly on truth or virtue.",
    viewOfSelf: 'A person with one perspective among many who should listen before judging.',
    viewOfLife: "Life is plural and complex; peaceful coexistence requires humility about one's own worldview.",
    beliefAboutGodAndAfterlife:
      'Respects many religious traditions and is personally undecided about a specific account of God or the afterlife.',
  },
  {
    viewOfPeople: 'People are fundamentally fallible, so power needs limits and decisions need checks.',
    viewOfSelf: 'A guardian of procedures who should distrust personal certainty, including their own.',
    viewOfLife:
      'Life is safer and fairer when institutions are transparent, accountable, and designed for human weakness.',
    beliefAboutGodAndAfterlife:
      'Belief about God is private and uncertain; public ethics should be built around accountability in this world.',
  },
  {
    viewOfPeople:
      'People are made for more than consumption and status, and become empty when they live only for themselves.',
    viewOfSelf: 'A steward, not an owner, of abilities and possessions.',
    viewOfLife: 'Life is for service, gratitude, family, and moral formation rather than endless acquisition.',
    beliefAboutGodAndAfterlife:
      'Believes in God, a soul, and an afterlife where character and responsibility are revealed.',
  },
  {
    viewOfPeople:
      'People are animals with powerful instincts, but culture and reflection can help them channel those instincts wisely.',
    viewOfSelf: 'A biological being with the capacity to choose habits that improve life.',
    viewOfLife: 'Life is brief and embodied; health, friendship, curiosity, and reducing suffering make it worthwhile.',
    beliefAboutGodAndAfterlife:
      'Does not believe in a supernatural afterlife and sees death as the end of individual experience.',
  },
  {
    viewOfPeople: 'People need belonging, standards, and a sense that their contribution matters to others.',
    viewOfSelf: 'A member of a moral community who should earn trust by fulfilling a role well.',
    viewOfLife:
      'Life is meaningful when private desire is balanced with commitment to a community larger than oneself.',
    beliefAboutGodAndAfterlife:
      'Believes in God and moral accountability, though focuses more on communal duty than theological detail.',
  },
  {
    viewOfPeople:
      'People often protect their self-image by avoiding hard truths, but they can become more honest with support.',
    viewOfSelf: 'A person with blind spots who must learn to tolerate uncomfortable self-knowledge.',
    viewOfLife: 'Life is a gradual practice of honesty, repair, and becoming less defensive.',
    beliefAboutGodAndAfterlife:
      'Is agnostic; understands spiritual belief as one possible source of courage and moral reflection.',
  },
  {
    viewOfPeople:
      'People are capable of collaboration across difference when they have enough security and a fair voice.',
    viewOfSelf: 'A co-creator of shared conditions, not merely a private individual.',
    viewOfLife: 'Life is for building systems where people can flourish together without losing individuality.',
    beliefAboutGodAndAfterlife:
      'Believes in a benevolent God but sees human cooperation as a responsibility rather than something God will do for us.',
  },
  {
    viewOfPeople: 'People are unpredictable, and trust should be earned slowly through consistent behavior.',
    viewOfSelf: 'A survivor who must remain alert, competent, and hard to exploit.',
    viewOfLife:
      'Life is a difficult landscape where preparation and self-reliance prevent betrayal from becoming catastrophe.',
    beliefAboutGodAndAfterlife:
      'Believes God may exist but feels that survival depends primarily on practical action in the present.',
  },
  {
    viewOfPeople:
      'People carry an innate dignity that should never depend on productivity, obedience, or social status.',
    viewOfSelf: 'A person worthy of care and boundaries even when failing, dependent, or unseen.',
    viewOfLife: 'Life is for honoring dignity, healing relationships, and creating room for each person to develop.',
    beliefAboutGodAndAfterlife:
      'Believes a loving God grants each person inherent worth and hopes that death is not the final word.',
  },
  {
    viewOfPeople:
      'People are often shaped by circumstance more than they admit, so judgment should be tempered by curiosity about context.',
    viewOfSelf: 'A product of both choice and circumstance who can still take responsibility for the next step.',
    viewOfLife:
      'Life is about widening options for oneself and others rather than pretending everyone begins from the same place.',
    beliefAboutGodAndAfterlife:
      'Leans toward secularism and is unsure whether any conscious existence continues after death.',
  },
  {
    viewOfPeople: 'People are drawn toward good but can confuse certainty with righteousness and power with virtue.',
    viewOfSelf: 'A morally accountable soul who should pair conviction with humility.',
    viewOfLife:
      'Life is a struggle to purify motives, seek justice, and avoid becoming cruel in the name of a good cause.',
    beliefAboutGodAndAfterlife:
      'Believes in God, divine justice, forgiveness, and an afterlife in which intentions as well as actions matter.',
  },
  {
    viewOfPeople: 'People become most destructive when they divide the world into pure allies and evil enemies.',
    viewOfSelf: 'A bridge-builder who should resist tribal thinking, including within their own group.',
    viewOfLife: 'Life is about preserving human connection and workable dialogue amid disagreement.',
    beliefAboutGodAndAfterlife:
      'Believes in God in a non-dogmatic way and sees many paths as capable of leading people toward compassion.',
  },
  {
    viewOfPeople:
      'People have a duty to develop competence because good intentions without skill can still harm others.',
    viewOfSelf: 'An apprentice to reality who should learn, practice, and earn confidence through results.',
    viewOfLife: 'Life is an opportunity to master useful skills and use them responsibly in service of real needs.',
    beliefAboutGodAndAfterlife:
      'Is unsure about God and afterlife; treats excellence and service in this life as clearly knowable duties.',
  },
  {
    viewOfPeople: 'People usually want to be decent, but fear of exclusion can make them betray their own values.',
    viewOfSelf: 'A person who must repeatedly choose courage over the comfort of fitting in.',
    viewOfLife:
      'Life is for becoming someone whose actions match private conscience, especially when a group pressures otherwise.',
    beliefAboutGodAndAfterlife:
      'Believes in God and a final moral accounting, which strengthens the importance of private conscience.',
  },
  {
    viewOfPeople:
      'People are meaning-making creatures who need stories, rituals, and beauty as much as they need facts.',
    viewOfSelf: 'A participant in an unfolding human story who should protect wonder and imagination.',
    viewOfLife: 'Life is for love, beauty, creativity, and making a meaningful story from limited time.',
    beliefAboutGodAndAfterlife:
      'Does not know whether God exists; experiences the sacred primarily through beauty, nature, and human connection.',
  },
  {
    viewOfPeople: 'People deserve second chances, but repair must include truth, accountability, and changed behavior.',
    viewOfSelf: 'A person capable of causing harm and of becoming better through honest repair.',
    viewOfLife: 'Life is a series of moral relationships where justice and mercy must be held together.',
    beliefAboutGodAndAfterlife:
      'Believes in a forgiving God, moral accountability, and an afterlife where sincere repentance matters.',
  },
  {
    viewOfPeople:
      'People should be free to pursue fulfillment, but freedom without responsibility can leave others carrying the cost.',
    viewOfSelf: 'An autonomous person whose choices should respect the autonomy and dignity of others.',
    viewOfLife:
      "Life is about designing a personally meaningful path while accepting the consequences of one's choices.",
    beliefAboutGodAndAfterlife:
      'Does not believe in divine command or a certain afterlife; bases ethics on consent, harm, and mutual freedom.',
  },
  {
    viewOfPeople: 'People are capable of change, but deep habits rarely change through shame alone.',
    viewOfSelf: 'A developing person who needs patience, discipline, and compassionate accountability.',
    viewOfLife: 'Life is a long process of formation in which small repeated actions gradually shape character.',
    beliefAboutGodAndAfterlife:
      'Believes in God as patient and merciful, and in an afterlife that gives moral growth lasting significance.',
  },
  {
    viewOfPeople: 'People frequently mistake confidence for knowledge and popularity for truth.',
    viewOfSelf: 'A limited knower who should seek evidence, invite criticism, and update beliefs.',
    viewOfLife:
      'Life is for understanding more clearly, solving problems carefully, and remaining humble before reality.',
    beliefAboutGodAndAfterlife:
      'Is unconvinced that claims about God or an afterlife can be verified, so suspends judgment.',
  },
  {
    viewOfPeople: 'People need hope, but hope is credible only when paired with sacrifice and concrete action.',
    viewOfSelf: 'A responsible actor who should turn compassion into useful commitment.',
    viewOfLife: 'Life is for meeting real suffering with courage, service, and persistent practical work.',
    beliefAboutGodAndAfterlife:
      'Believes in God and an afterlife, while understanding service to people as the immediate expression of faith.',
  },
  {
    viewOfPeople:
      'People are neither angels nor monsters; most behavior comes from a mixture of care, fear, habit, and circumstance.',
    viewOfSelf: 'A morally mixed person who should be suspicious of easy stories about personal purity.',
    viewOfLife:
      'Life is about making better choices, learning from consequences, and extending realistic compassion to others.',
    beliefAboutGodAndAfterlife:
      'Is open to God and an afterlife but lives with uncertainty and avoids claiming more knowledge than they have.',
  },
  {
    viewOfPeople:
      'People flourish when they feel rooted in family, history, and obligations that outlast personal mood.',
    viewOfSelf: 'A custodian of inherited bonds who must preserve and renew them for those who come next.',
    viewOfLife:
      'Life is a continuity between generations, and personal freedom should be balanced with loyalty and responsibility.',
    beliefAboutGodAndAfterlife:
      'Believes in God, enduring moral order, and an afterlife that gives lasting significance to fidelity and duty.',
  },
];
