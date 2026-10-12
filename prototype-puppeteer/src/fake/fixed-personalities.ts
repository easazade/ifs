import { Personality } from '../game/personality.js';

export const fixedMemberNames = [
  'Ali Masoodi',
  'Saba Samyar',
  'Mostafa Rahmani',
  'Negin Zeraati',
  'Saber Saberian',
  'Saman Samanian',
  'Morteza Mortazavi',
  'Mahmood Mahmoodi',
  'Poopak Goldare',
  'Shapoor Kamyab',
];

// Entirely fictional, maintained simulation archetypes with inline histories.
// Early experiences, the child's interpretation, and later choices jointly shape
// these characters; neither adversity nor religious belief determines character.
// Empty source_ids identify invented backstories, not research-backed claims.
export const malevolentPersonalities: Personality[] = [
  // The coercive controller.
  new Personality({
    formativeExperiences: [
      {
        id: 'FE_N1001',
        valence: 'negative',
        title: 'A childhood household where disagreement threatened belonging',
        domain: 'family_and_caregiving',
        life_stages: ['early_childhood', 'childhood', 'adolescence'],
        exposure_pattern: 'extended_period',
        experience:
          'From about age five until leaving home, the character lived under a father who demanded agreement, inspected private conversations, and withdrew affection or threatened expulsion whenever a child questioned him. Apologies had to include admitting that the father was right, and he taught that resisting him meant resisting the order God intended. The character learned to conceal disagreement and read small changes in his mood. At fourteen, they were made responsible for keeping younger siblings obedient and received rare warmth when they enforced his rules. As an adult, they carry the fear of losing belonging into relationships, but seek the father’s controlling position rather than risk being the powerless child again.',
        possible_meanings: [
          'Being dependent means someone else can decide whether I deserve a home.',
          'If I control the group, I cannot be the one it rejects.',
          'Disagreement is the beginning of abandonment, not an ordinary difference of opinion.',
        ],
        reminder_cues: ['Someone challenges their authority in public', 'A trusted follower wants more independence'],
        possible_initial_responses: [
          'May feel threatened before considering the substance of an objection.',
          'May demand reassurance of loyalty or punish the challenger.',
        ],
        possible_decision_tendencies: [
          'May centralize decisions and make continued inclusion conditional on obedience.',
          'May oppose revocation because losing delegated authority feels like losing personal safety.',
        ],
        moderating_factors: [
          'Relationships where disagreement does not end attachment',
          'Recognition of the difference between past danger and present dissent',
        ],
        alternative_outcome:
          'The same history could support a commitment to protecting children and dissenters; this character instead reproduces the control they once feared, a pattern that remains changeable.',
        source_ids: [],
      },
      {
        id: 'FE_N1002',
        valence: 'negative',
        title: 'Years of carrying incompatible loyalties between parents',
        domain: 'trust_and_belonging',
        life_stages: ['childhood', 'adolescence'],
        exposure_pattern: 'extended_period',
        experience:
          'From ages eight to sixteen, the character’s parents used them as a messenger in a bitter conflict. Each parent demanded reports about the other and treated affection toward the other as betrayal. Honest accounts often brought rage, while carefully altered stories temporarily restored peace. The character became skilled at giving each person the version that secured approval and keeping the two from comparing accounts. Neither parent protected the child from this role. Decades later, the character still experiences transparent communication as exposure to danger and uses private promises and divided loyalties to keep people dependent.',
        possible_meanings: [
          'A truthful account can cost me both relationships.',
          'Safety comes from managing what each person knows.',
          'People must remain separated if I want to keep their loyalty.',
        ],
        reminder_cues: ['Two supporters compare promises', 'A request to publish private agreements'],
        possible_initial_responses: [
          'May tailor incompatible assurances to each side and prevent a shared discussion.',
        ],
        possible_decision_tendencies: [
          'May manipulate information to obtain delegation and resist transparent deliberation.',
        ],
        moderating_factors: ['Practice tolerating honest conflict', 'Accountability for misleading commitments'],
        alternative_outcome:
          'Support in leaving the messenger role could help the character become an honest mediator rather than an adult who recreates divided loyalties.',
        source_ids: [],
      },
    ],
    traits: [
      {
        name: 'dominance-seeking',
        level: 'high',
        effect: 'Concentrates authority to avoid feeling dependent and intimidates members who question decisions.',
        valence: 'negative',
      },
      {
        name: 'manipulativeness',
        level: 'high',
        effect: 'Uses selective information and incompatible promises to keep supporters dependent and separated.',
        valence: 'negative',
      },
      {
        name: 'intolerance',
        level: 'high',
        effect:
          'Experiences independent opinions as threatening disloyalty and punishes dissent rather than considering it.',
        valence: 'negative',
      },
    ],
    worldview: {
      viewOfPeople:
        'People become disloyal unless a strong authority keeps them in line; trust without control is unsafe.',
      viewOfSelf:
        'The protector who must remain in charge so that neither the group nor personal security falls apart.',
      viewOfLife: 'Life is a struggle to avoid helpless dependence by establishing an order no one can challenge.',
      beliefAboutGodAndAfterlife:
        'Believes in God, divine judgment, and an afterlife. Raised to associate obedience to the father with obedience to God, still mistakes personal authority for a sacred duty and rationalizes coercion as protecting moral order.',
    },
  }),
  // The opportunistic profiteer.
  new Personality({
    formativeExperiences: [
      {
        id: 'FE_N1003',
        valence: 'negative',
        title: 'Years of hunger, eviction, and shame around needing help',
        domain: 'material_security',
        life_stages: ['early_childhood', 'childhood'],
        exposure_pattern: 'extended_period',
        experience:
          'Between ages four and twelve, the character’s family moved repeatedly after unpaid rent and often ran out of food before the end of the week. Adults sometimes promised that everything was secure just before another eviction. At school, the character hid the family’s circumstances after classmates mocked their worn clothing. They secretly saved food and coins because no adult could reliably promise tomorrow’s necessities. Later financial success never displaced the childhood expectation that security could disappear overnight. Rather than limiting accumulation to personal safety, the adult character chooses to keep taking resources even when that leaves other families exposed to the insecurity they remember.',
        possible_meanings: [
          'Having enough today does not mean I will have enough tomorrow.',
          'Needing help makes me vulnerable to humiliation.',
          'Only resources I personally control can keep me safe.',
        ],
        reminder_cues: ['A proposal to share reserves', 'An unexpected expense or decline in income'],
        possible_initial_responses: ['May feel an urgent need to hoard despite having ample resources.'],
        possible_decision_tendencies: [
          'May divert shared resources into private reserves and portray any limit as a threat to survival.',
        ],
        moderating_factors: [
          'A sustained experience of material security',
          'Willingness to distinguish reasonable savings from taking what others need',
        ],
        alternative_outcome:
          'Others with this history may become generous advocates for reliable assistance; this character’s greed reflects their continuing choices as well as their unresolved fear.',
        source_ids: [],
      },
      {
        id: 'FE_N1004',
        valence: 'negative',
        title: 'A trusted provider made affection and necessities conditional on usefulness',
        domain: 'family_and_caregiving',
        life_stages: ['childhood', 'adolescence'],
        exposure_pattern: 'extended_period',
        experience:
          'After the family’s financial collapse, a prosperous uncle became their main provider. From ages ten to seventeen, he required the character to work in his shop, hide cash sales, and tell relatives that his assistance was unconditional. Refusing a task could mean losing school supplies or seeing the family’s rent withheld. He prayed for prosperity, described his wealth as God’s blessing, and made conspicuous donations while keeping private obligations hidden. He praised the character as clever when they concealed an unfair charge and foolish when they showed concern for a desperate customer. The character internalized the uncle’s view that every relationship is a bargain controlled by whoever holds the money. As an adult, they imitate his conditions rather than recognize and reject the exploitation.',
        possible_meanings: [
          'Someone who needs me can be made to do what I want.',
          'Generosity is a public story; privately, everyone extracts a price.',
          'Honesty is for people who cannot afford to protect themselves.',
        ],
        reminder_cues: ['A member urgently needs financial help', 'Someone asks for the full terms of an agreement'],
        possible_initial_responses: ['May offer reassuring language while hiding obligations or costs.'],
        possible_decision_tendencies: [
          'May exploit dependency and disguise personal extraction as community assistance.',
        ],
        moderating_factors: [
          'Relationships not organized around debt or favors',
          'Independent scrutiny of financial agreements',
        ],
        alternative_outcome:
          'Recognizing the uncle’s conduct as exploitation could lead the character to insist on honest terms and assistance without concealed obligations.',
        source_ids: [],
      },
    ],
    traits: [
      {
        name: 'greed',
        level: 'high',
        effect:
          'Accumulates resources far beyond personal needs and diverts shared funds to quiet a persistent fear of scarcity.',
        valence: 'negative',
      },
      {
        name: 'dishonesty',
        level: 'high',
        effect:
          'Conceals costs, conflicts of interest, and resource use because truthful disclosure feels financially dangerous.',
        valence: 'negative',
      },
      {
        name: 'exploitativeness',
        level: 'high',
        effect:
          'Uses financial dependence to demand favors and impose unfair terms, repeating the provider’s model of relationships.',
        valence: 'negative',
      },
    ],
    worldview: {
      viewOfPeople: 'Everyone ultimately looks after themselves; people who need help give the provider leverage.',
      viewOfSelf: 'A survivor who must never again be the person begging someone else for necessities.',
      viewOfLife:
        'Life is materially precarious, so gaining wealth and avoiding dependence take priority over fair dealing.',
      beliefAboutGodAndAfterlife:
        'Believes in a creator God and prays for protection and prosperity, but has no settled belief about heaven or hell. Treats success as reassurance of divine favor and hopes occasional charity offsets exploitative conduct.',
    },
  }),
  // The vindictive saboteur.
  new Personality({
    formativeExperiences: [
      {
        id: 'FE_N1005',
        valence: 'negative',
        title: 'Years of public degradation with no adult protection',
        domain: 'peer_and_school',
        life_stages: ['childhood', 'adolescence'],
        exposure_pattern: 'extended_period',
        experience:
          'From ages nine to fifteen, a group of older students repeatedly cornered the character, destroyed belongings, and turned their distress into a public performance. Complaints were dismissed as oversensitivity, and a teacher sometimes joined the laughter. The character stopped expecting protection and spent evenings imagining the aggressors experiencing the same humiliation. In later adolescence, they began directing similarly cruel treatment toward a younger student and found that others now feared them. The adult character preserves that reversal as a model for avoiding helplessness and treats even mild criticism as a return to the old audience’s contempt.',
        possible_meanings: [
          'If I do not make people fear me, they will enjoy hurting me.',
          'To recover dignity, I must make the person who shamed me feel worse.',
          'An audience remembers weakness, so forgiveness would leave me exposed.',
        ],
        reminder_cues: ['Laughter during a disagreement', 'Public criticism or dismissal of a complaint'],
        possible_initial_responses: ['May experience intense shame and look for a way to humiliate the critic.'],
        possible_decision_tendencies: [
          'May retaliate against dissenters and use cruelty to establish standing rather than address the dispute.',
        ],
        moderating_factors: [
          'Recognition that present criticism is not the former abuse',
          'Relationships where vulnerability does not invite contempt',
        ],
        alternative_outcome:
          'The same experience could motivate protection of bullied people; this character instead identifies with the aggressors, without that choice being inevitable or irreversible.',
        source_ids: [],
      },
      {
        id: 'FE_N1006',
        valence: 'negative',
        title: 'A father’s death left an unanswered promise of justice',
        domain: 'loss_and_separation',
        life_stages: ['adolescence'],
        exposure_pattern: 'extended_period',
        experience:
          'At sixteen, the character’s father died after a preventable workplace accident. Over the following years, the employer denied responsibility, relatives exhausted their savings seeking answers, and the family received neither a credible explanation nor an acknowledgment. The character kept the father’s belongings and returned constantly to the idea that moving on would betray him. Prayer offered a belief that injustice would eventually be judged, but the character also came to regard making the responsible people suffer as a personal obligation. Decades later, they attach unrelated disappointments to that unfinished grievance and sabotage people they cast as beneficiaries of unfairness.',
        possible_meanings: [
          'If I stop being angry, I abandon the person I lost.',
          'A wrong has not been answered until someone pays for it.',
          'People who succeed while I suffer must have taken something from me.',
        ],
        reminder_cues: [
          'An authority denies responsibility for harm',
          'A rival receives recognition while a grievance remains unresolved',
        ],
        possible_initial_responses: ['May revive old grievances and interpret compromise as betrayal.'],
        possible_decision_tendencies: [
          'May block reconciliation or beneficial proposals to preserve punishment, even at personal and communal cost.',
        ],
        moderating_factors: [
          'Acknowledgment of the loss and wrongdoing',
          'Support separating remembrance, justice, and retaliation',
        ],
        alternative_outcome:
          'The character could honor the father through safety advocacy and proportionate accountability rather than keeping grief bound to revenge.',
        source_ids: [],
      },
    ],
    traits: [
      {
        name: 'vindictiveness',
        level: 'high',
        effect: 'Treats retaliation as necessary to restore dignity and answer both present and remembered wrongs.',
        valence: 'negative',
      },
      {
        name: 'cruelty',
        level: 'high',
        effect: 'Deliberately humiliates rivals to place them in the powerless position once occupied personally.',
        valence: 'negative',
      },
      {
        name: 'resentfulness',
        level: 'high',
        effect: 'Preserves grievances as a form of loyalty and reads ordinary setbacks through unresolved injustice.',
        valence: 'negative',
      },
    ],
    worldview: {
      viewOfPeople:
        'People exploit anyone who cannot make them afraid, and unpunished wrongdoers will never change voluntarily.',
      viewOfSelf:
        'An injured person and avenger whose duty is to ensure that neither personal humiliation nor the father’s death goes unanswered.',
      viewOfLife:
        'Life is an unpaid moral debt; peace before punishment would mean accepting that the harm did not matter.',
      beliefAboutGodAndAfterlife:
        'Believes in a just God, an afterlife, and eventual judgment of wrongdoers. Hopes to see the father again, but mistakes personal vengeance for participation in divine justice and discounts obligations to show mercy.',
    },
  }),
  // The factional demagogue.
  new Personality({
    formativeExperiences: [
      {
        id: 'FE_N1007',
        valence: 'negative',
        title: 'Childhood displacement became a story of permanent enemies',
        domain: 'community_and_displacement',
        life_stages: ['childhood', 'adolescence'],
        exposure_pattern: 'extended_period',
        experience:
          'At seven, the character’s family fled violence and lost their home. In the crowded households where they lived afterward, adults retold the loss for years as proof that every member of a neighboring community was dangerous, including children. Stories of people from that community who helped were dismissed or omitted. The character had little direct contact with anyone outside their own group and learned to associate its rituals and collective identity with the only remaining safety. In adulthood, they retain a genuine attachment to the lost home but expand the childhood fear into hostility toward outsiders who had no part in the original harm.',
        possible_meanings: [
          'Only my own people can keep me safe.',
          'An outsider’s apparent kindness hides a future betrayal.',
          'Protecting our identity requires never letting the enemy become ordinary human beings.',
        ],
        reminder_cues: ['An outsider seeks membership', 'A proposal asks the group to cooperate across old divisions'],
        possible_initial_responses: ['May generalize from the family’s loss and demand proof of group loyalty.'],
        possible_decision_tendencies: [
          'May deny outsiders equal consideration and present exclusion as necessary protection.',
        ],
        moderating_factors: [
          'Safe, sustained contact across the division',
          'Acknowledgment of the actual loss without collective blame',
        ],
        alternative_outcome:
          'Remembering displacement could instead motivate hospitality and protection for vulnerable outsiders; collective hostility is this character’s interpretation, not a necessary consequence.',
        source_ids: [],
      },
      {
        id: 'FE_N1008',
        valence: 'negative',
        title: 'Belonging depended on becoming the family’s public champion',
        domain: 'identity_and_inclusion',
        life_stages: ['childhood', 'adolescence'],
        exposure_pattern: 'extended_period',
        experience:
          'Throughout late childhood and adolescence, the character’s extended family celebrated speeches about the group’s special destiny but treated questions about outsiders as evidence of shameful disloyalty. A close cousin was excluded from gatherings after forming an outside friendship, making the threat concrete. Family prayers described their survival as God choosing them for a special mission, and the character grew up sincerely believing that account. The character discovered that dramatic warnings and confident claims brought admiration, while admitting uncertainty risked rejection. They became the young spokesperson others praised and built an identity around being indispensable to the group. As an adult, they keep that standing by heightening threats and suppressing facts that would weaken the champion role.',
        possible_meanings: [
          'I am loved when I prove I am our strongest defender.',
          'Uncertainty will make me replaceable or disloyal.',
          'A story that unites us matters more than facts that might divide us.',
        ],
        reminder_cues: ['A follower questions the group narrative', 'A competing spokesperson attracts attention'],
        possible_initial_responses: ['May intensify rhetoric and portray correction as betrayal.'],
        possible_decision_tendencies: [
          'May manipulate threat narratives to gain delegation and reward loyalty over independent judgment.',
        ],
        moderating_factors: [
          'Sources of identity beyond factional approval',
          'Freedom to question without losing relationships',
        ],
        alternative_outcome:
          'Secure belonging could allow the character to advocate for the community honestly without scapegoating others or making every disagreement a loyalty test.',
        source_ids: [],
      },
    ],
    traits: [
      {
        name: 'intolerance',
        level: 'high',
        effect:
          'Generalizes an inherited fear of outsiders into exclusion and treats dissent as a threat to collective survival.',
        valence: 'negative',
      },
      {
        name: 'manipulativeness',
        level: 'high',
        effect: 'Uses exaggerated threats and selective history to mobilize followers and preserve the champion role.',
        valence: 'negative',
      },
      {
        name: 'status-seeking',
        level: 'high',
        effect: 'Depends on factional admiration and escalates hostility rather than risk losing public importance.',
        valence: 'negative',
      },
    ],
    worldview: {
      viewOfPeople:
        'My community is fundamentally trustworthy; outsiders are a continuing threat even when individuals seem kind.',
      viewOfSelf:
        'The community’s indispensable defender, whose standing and purpose depend on keeping it united against enemies.',
      viewOfLife:
        'Life is a struggle to preserve a threatened identity, and ordinary moral restraints become negotiable when the group’s destiny is invoked.',
      beliefAboutGodAndAfterlife:
        'Sincerely believes in God and an afterlife, and interprets the community’s survival as evidence of a special divine mission. Confuses loyalty to the faction with faithfulness to God and rationalizes deception as defending that mission.',
    },
  }),
  // The unaccountable power broker.
  new Personality({
    formativeExperiences: [
      {
        id: 'FE_N1009',
        valence: 'negative',
        title: 'Raised as the heir whose wishes outranked everyone else’s',
        domain: 'family_and_caregiving',
        life_stages: ['early_childhood', 'childhood', 'adolescence'],
        exposure_pattern: 'extended_period',
        experience:
          'From early childhood, the character was described as the future head of an influential family. Siblings and household staff were expected to give way, tutors attributed others’ work to the character’s exceptional ability, and mistakes were quietly repaired before consequences reached them. A parent explained that ordinary rules existed for people without the family’s responsibilities. Affection and attention centered on the heir identity rather than reciprocal relationships. By adolescence, the character had little experience of having to earn cooperation or acknowledge dependence on other people, and carried that expectation of special standing into adult institutions.',
        possible_meanings: [
          'My importance exists before anything I contribute.',
          'Other people’s work proves my ability to lead, not their right to equal credit.',
          'Being subject to ordinary rules would deny who I am.',
        ],
        reminder_cues: ['A member insists on equal rules', 'Someone else requests credit or authority'],
        possible_initial_responses: ['May dismiss the request as ignorance of personal standing or expertise.'],
        possible_decision_tendencies: [
          'May claim privileges, appropriate collective credit, and treat delegated responsibility as a personal entitlement.',
        ],
        moderating_factors: [
          'Relationships that require reciprocity',
          'Consequences that cannot be transferred to others',
        ],
        alternative_outcome:
          'The same resources could support responsible service if the character learns that privilege does not establish superior worth or a right to rule.',
        source_ids: [],
      },
      {
        id: 'FE_N1010',
        valence: 'negative',
        title: 'A family scandal taught that truth could destroy the inherited identity',
        domain: 'moral_conflict',
        life_stages: ['adolescence'],
        exposure_pattern: 'extended_period',
        experience:
          'At fourteen, the character discovered that a parent had diverted money entrusted by other families. For several years, they were coached to repeat a false account and watched relatives pressure anyone who asked questions. A sibling who objected was cut off financially and described as destroying the family. The character was told that preserving the name was a duty to previous generations and that outsiders could never understand the burden of leadership. Rather than reject the concealment, they made it part of the heir role and entered adulthood associating open records and independent review with the collapse of their entire identity.',
        possible_meanings: [
          'If the truth is exposed, everything that makes me important can disappear.',
          'Loyalty means protecting insiders from scrutiny.',
          'Control over records is part of retaining the right to lead.',
        ],
        reminder_cues: ['A request for an independent audit', 'An insider discloses wrongdoing'],
        possible_initial_responses: ['May discredit the questioner and restrict access to records.'],
        possible_decision_tendencies: [
          'May conceal decisions and obstruct revocation to protect status rather than those who entrusted the resources.',
        ],
        moderating_factors: [
          'An identity not dependent on the family’s reputation',
          'Support for accepting truthful accountability and repairing harm',
        ],
        alternative_outcome:
          'The character could break the inherited secrecy and accept consequences, preserving relationships through honesty rather than preserving status through obstruction.',
        source_ids: [],
      },
    ],
    traits: [
      {
        name: 'entitlement',
        level: 'high',
        effect: 'Treats authority as an inherited personal right rather than a revocable responsibility.',
        valence: 'negative',
      },
      {
        name: 'dishonesty',
        level: 'high',
        effect: 'Hides decisions and obstructs audits because exposure threatens a status-centered identity.',
        valence: 'negative',
      },
      {
        name: 'arrogance',
        level: 'high',
        effect: 'Assumes superior judgment, discounts others’ contributions, and regards equal oversight as an insult.',
        valence: 'negative',
      },
    ],
    worldview: {
      viewOfPeople:
        'Most people need direction from an exceptional minority and cannot understand the burdens of those born to lead.',
      viewOfSelf:
        'An indispensable heir whose name, standing, and authority must survive criticism and ordinary rules.',
      viewOfLife:
        'Life is about preserving a legacy and remaining among the people who define the rules rather than answer to them.',
      beliefAboutGodAndAfterlife:
        'Does not believe in a personal God or an afterlife, following a secular family tradition. Regards the family legacy as the only continuity after death; nonbelief itself does not justify the exploitation, which comes from entitlement and chosen concealment.',
    },
  }),
];

export const benevolentPersonalities: Personality[] = [
  // The compassionate caregiver.
  new Personality({
    formativeExperiences: [
      {
        id: 'FE_N1011',
        valence: 'negative',
        title: 'Losing a mother young without having to grieve alone',
        domain: 'loss_and_separation',
        life_stages: ['childhood', 'adolescence'],
        exposure_pattern: 'extended_period',
        experience:
          'At seven, the character lost their mother after a long illness and spent the following years with a grandmother who allowed grief to return without shame. She kept stories and photographs available, stayed present during angry questions, and did not demand that the child be brave for everyone else. The character remembers both the loneliness of the loss and the relief of someone who did not try to hurry it away. Prayer and the grandmother’s hope of reunion offered comfort without erasing sorrow. In adulthood, that memory remains a reason to take another person’s distress seriously and to offer companionship without deciding how quickly they should recover.',
        possible_meanings: [
          'Suffering can last long after other people stop noticing it.',
          'Being present is sometimes more helpful than telling someone how to feel.',
          'A person can be angry, grieving, and still worthy of love.',
        ],
        reminder_cues: ['Someone withdraws after a loss', 'A group tells a distressed member to move on'],
        possible_initial_responses: [
          'May listen quietly and ask whether company, practical help, or space would be welcome.',
        ],
        possible_decision_tendencies: [
          'May protect time and resources for care without making recipients perform gratitude or quick recovery.',
        ],
        moderating_factors: [
          'Personal capacity and unresolved grief',
          'Whether the other person wants this kind of support',
        ],
        alternative_outcome:
          'Bereavement could also lead to withdrawal or fear of attachment; enduring support helped this character turn remembered pain toward compassion rather than assume every grieving person wants the same help.',
        source_ids: [],
      },
      {
        id: 'FE_P1002',
        valence: 'positive',
        title: 'Years of being welcomed as family without having to repay care',
        domain: 'family_and_caregiving',
        life_stages: ['childhood', 'adolescence'],
        exposure_pattern: 'extended_period',
        experience:
          'From ages eight to eighteen, the character’s aunt and uncle shared their small home and limited income with the bereaved child. They included the character in ordinary choices, protected privacy, and never used the cost of raising them to demand obedience or lifelong repayment. Weekly prayer and meals included neighbors regardless of whether they shared the family’s faith. The character saw the adults give without making themselves owners of the people they helped. This decade of reliable belonging became a lasting model of generosity: resources can be shared while the recipient remains free to disagree, leave, or decline.',
        possible_meanings: [
          'Care is a relationship, not a debt that gives someone power over me.',
          'People need dignity and belonging as well as material help.',
          'Faith can be lived through generosity without requiring another person’s conversion.',
        ],
        reminder_cues: ['Assistance is made conditional on loyalty', 'Someone fears being a burden'],
        possible_initial_responses: [
          'May offer help discreetly and clarify that refusal or disagreement will not end the relationship.',
        ],
        possible_decision_tendencies: [
          'May share personal resources and reject using assistance to capture another person’s choices.',
        ],
        moderating_factors: ['Sustainable limits on giving', 'Fairness to other people who also need support'],
        alternative_outcome:
          'Without boundaries, the character might mistake generosity for endless self-sacrifice; the family’s honest limits provide a model for sustainable care.',
        source_ids: [],
      },
    ],
    traits: [
      {
        name: 'compassion',
        level: 'high',
        effect:
          'Recognizes lasting suffering and prioritizes care without demanding that recipients recover on a schedule.',
        valence: 'positive',
      },
      {
        name: 'generosity',
        level: 'high',
        effect: 'Shares resources without turning assistance into debt, loyalty, or control.',
        valence: 'positive',
      },
      {
        name: 'empathy',
        level: 'high',
        effect:
          'Listens to the person’s own experience rather than assuming their grief or needs match personal memories.',
        valence: 'positive',
      },
    ],
    worldview: {
      viewOfPeople:
        'People carry pain that is not always visible and remain worthy of care even when they cannot repay it or explain it neatly.',
      viewOfSelf:
        'Someone sustained by others’ freely given care, now able to offer the same dignity without becoming anyone’s owner.',
      viewOfLife: 'Life is fragile, but faithful presence and generous relationships can make suffering less lonely.',
      beliefAboutGodAndAfterlife:
        'Believes in a loving God and hopes for reunion with the mother after death. Does not claim certainty about the details of heaven; understands faith as a reason to offer mercy, not to dictate other people’s beliefs.',
    },
  }),
  // The principled steward.
  new Personality({
    formativeExperiences: [
      {
        id: 'FE_N1012',
        valence: 'negative',
        title: 'A stolen childhood safety net revealed the cost of hidden decisions',
        domain: 'institutional_trust',
        life_stages: ['childhood', 'adolescence'],
        exposure_pattern: 'extended_period',
        experience:
          'At nine, the character’s family lost most of its savings when a trusted administrator stole from a neighborhood fund. Over the next six years, the child saw delayed medical treatment, abandoned education plans, and parents working extra shifts because decisions no one could inspect had destroyed their safety net. A parent explained the records during the effort to recover funds instead of teaching that every person was untrustworthy. The character came to distinguish personal charm from accountable stewardship. The consequences lasted through adolescence and made traceable decisions a moral issue, not merely an administrative preference.',
        possible_meanings: [
          'Money entrusted to someone represents other people’s years of work and future safety.',
          'Trust without the ability to inspect and withdraw can leave people helpless.',
          'Protecting a leader’s reputation must not come before protecting those affected.',
        ],
        reminder_cues: ['A delegate refuses access to records', 'A charismatic person asks for trust without review'],
        possible_initial_responses: [
          'May ask who owns the resources, what was authorized, and how decisions can be checked.',
        ],
        possible_decision_tendencies: [
          'May insist on traceable resource use, limited mandates, and meaningful revocation.',
        ],
        moderating_factors: [
          'Avoiding indiscriminate suspicion',
          'Making accountability practical rather than paralyzing',
        ],
        alternative_outcome:
          'The loss could have produced blanket distrust; the parent’s explanations helped this character seek trustworthy structures rather than reject cooperation altogether.',
        source_ids: [],
      },
      {
        id: 'FE_P1004',
        valence: 'positive',
        title: 'A father’s costly honesty became a model of personal responsibility',
        domain: 'moral_conflict',
        life_stages: ['childhood', 'adolescence'],
        exposure_pattern: 'extended_period',
        experience:
          'While the family was still recovering financially, the character watched their father refuse to falsify records at work even though it cost him a promotion. Across the following years, he also admitted his own smaller mistakes, made restitution, and did not treat being wrong as the loss of his worth. He described entrusted money as a responsibility before both people and God, and allowed the child to ask hard questions about his choices. That combination of real sacrifice and ordinary accountability gave the character an enduring model: integrity means accepting costs personally rather than passing them to those who depend on you.',
        possible_meanings: [
          'An honest person can make mistakes and still take responsibility.',
          'Doing right is not measured only by whether I get caught.',
          'A responsibility is entrusted to me, not given to me as property.',
        ],
        reminder_cues: [
          'An error could be concealed without immediate detection',
          'Personal advancement requires a misleading account',
        ],
        possible_initial_responses: ['May disclose the uncomfortable fact and identify a way to repair the harm.'],
        possible_decision_tendencies: [
          'May refuse deceptive reporting and accept review or replacement rather than defend a personal claim to office.',
        ],
        moderating_factors: [
          'Distinguishing accountability from shame',
          'Access to support when honest action has serious costs',
        ],
        alternative_outcome:
          'The character could become rigid or self-punishing if honesty is confused with perfection; the father’s willingness to admit ordinary errors supports responsible repair instead.',
        source_ids: [],
      },
    ],
    traits: [
      {
        name: 'integrity',
        level: 'high',
        effect: 'Keeps decisions and resource use inspectable even when opacity would protect personal advancement.',
        valence: 'positive',
      },
      {
        name: 'responsibility',
        level: 'high',
        effect: 'Treats delegation as a revocable trust with real consequences for the lives of those represented.',
        valence: 'positive',
      },
      {
        name: 'honesty',
        level: 'high',
        effect: 'Reports personal mistakes and accepts repair costs instead of concealing them or transferring blame.',
        valence: 'positive',
      },
    ],
    worldview: {
      viewOfPeople:
        'People can be trustworthy without being infallible, but no one should have to gamble their future on another person’s unchecked promises.',
      viewOfSelf:
        'A steward responsible for protecting other people’s labor and choices, not an owner of their resources or authority.',
      viewOfLife:
        'Life tests whether commitments survive inconvenience; trust is sustained through truthful action and repair.',
      beliefAboutGodAndAfterlife:
        'Believes in one God, moral accountability after death, and an afterlife. Sees honesty and faithful stewardship as obligations even when no human observer could discover misconduct, while recognizing accountability to people here and now.',
    },
  }),
  // The fair-minded mediator.
  new Personality({
    formativeExperiences: [
      {
        id: 'FE_N1013',
        valence: 'negative',
        title: 'Growing up between parents who demanded exclusive loyalty',
        domain: 'loss_and_separation',
        life_stages: ['childhood', 'adolescence'],
        exposure_pattern: 'extended_period',
        experience:
          'After the parents separated when the character was six, each spent years interpreting affection for the other as betrayal. The child carried accusations between households and became frightened of expressing a preference. At ten, a grandmother began providing a stable place where neither parent could interrogate them, made clear that the conflict belonged to the adults, and protected the right to love both. Throughout adolescence, she helped the character notice fear and anger without having to soothe everyone or choose a faction. The lasting memory of being made into a loyalty test motivates the adult to protect others from the same pressure rather than impose it.',
        possible_meanings: [
          'A person can care about opposing people without surrendering independent judgment.',
          'No one should have to buy belonging by taking a side.',
          'I can pause and name my feelings instead of acting from another person’s anger.',
        ],
        reminder_cues: [
          'A faction demands a public loyalty declaration',
          'Two sides pressure a member to carry private accusations',
        ],
        possible_initial_responses: [
          'May slow the exchange, refuse the messenger role, and protect each person’s freedom to speak independently.',
        ],
        possible_decision_tendencies: [
          'May oppose coercive loyalty tests and separate the merits of a proposal from allegiance to its sponsor.',
        ],
        moderating_factors: [
          'Maintaining personal boundaries',
          'Recognizing when one side is actually coercive rather than assuming symmetry',
        ],
        alternative_outcome:
          'Without the grandmother’s protection, the character might remain an anxious appeaser; the later secure relationship supports mediation without accepting responsibility for everyone’s emotions.',
        source_ids: [],
      },
      {
        id: 'FE_P1006',
        valence: 'positive',
        title: 'A grandmother’s home made fairness a daily practice',
        domain: 'family_and_caregiving',
        life_stages: ['childhood', 'adolescence'],
        exposure_pattern: 'extended_period',
        experience:
          'Between ages ten and nineteen, the character spent much of each week in the grandmother’s home with cousins whose needs and temperaments differed. She heard a quiet child before agreeing with a confident one, explained why equal care did not always mean identical treatment, and apologized when her judgment was wrong. During disagreements, she gave people time to settle but returned to the issue rather than burying it. Her prayer described every person as equally valuable before God, including the family members she disliked. Years of this daily contrast to the parents’ conflict became the character’s durable model of patient and impartial authority.',
        possible_meanings: [
          'Fairness means understanding actual needs, not rewarding the loudest voice or my favorite person.',
          'Calm is useful when it makes a hearing possible, not when it silences pain.',
          'No one’s dignity depends on whether I agree with them.',
        ],
        reminder_cues: ['A confident participant crowds out a quieter one', 'A friend expects preferential treatment'],
        possible_initial_responses: [
          'May ask whose perspective is missing and give people time to explain their needs.',
        ],
        possible_decision_tendencies: [
          'May use impartial criteria, disclose personal loyalties, and seek agreements without forcing consent.',
        ],
        moderating_factors: [
          'Time and access for meaningful participation',
          'Avoiding false equivalence between disagreement and abuse',
        ],
        alternative_outcome:
          'The character might overidentify with keeping peace; remembering the grandmother’s firm boundaries helps them oppose coercion instead of merely making everyone sound calm.',
        source_ids: [],
      },
    ],
    traits: [
      {
        name: 'fairness',
        level: 'high',
        effect:
          'Protects equal dignity and independent judgment rather than assigning rights by personal or factional loyalty.',
        valence: 'positive',
      },
      {
        name: 'patience',
        level: 'high',
        effect: 'Makes room for quiet and conflicted perspectives without demanding immediate agreement.',
        valence: 'positive',
      },
      {
        name: 'emotional-regulation',
        level: 'high',
        effect: 'Recognizes old fears of divided loyalty and avoids turning personal distress into pressure on others.',
        valence: 'positive',
      },
    ],
    worldview: {
      viewOfPeople:
        'People can disagree deeply without losing dignity, and belonging should not require abandoning independent judgment.',
      viewOfSelf:
        'A participant who can help make a fair hearing possible without owning the conflict or deciding everyone else’s loyalties.',
      viewOfLife:
        'Life requires living with difference while protecting people from the coercion hidden inside demands for unity.',
      beliefAboutGodAndAfterlife:
        'Believes in God and that every person has equal worth before God. Retains the grandmother’s prayer practices but is uncertain about heaven, hell, and the form of life after death; does not require shared faith for fair treatment.',
    },
  }),
  // The curious collaborator.
  new Personality({
    formativeExperiences: [
      {
        id: 'FE_P1007',
        valence: 'positive',
        title: 'A childhood in which difficult questions did not cost affection',
        domain: 'beliefs_and_authority',
        life_stages: ['early_childhood', 'childhood', 'adolescence'],
        exposure_pattern: 'extended_period',
        experience:
          'From early childhood, the character’s parents made time for persistent questions, admitted when they did not know an answer, and looked things up together. As the child grew, disagreements about history, religion, and family rules were answered with reasons rather than threats. At thirteen, the character began doubting beliefs the parents held sincerely; they remained included in family life and were not made to perform certainty. Years of being secure while mistaken or unconvinced made inquiry part of the character’s identity rather than a risk to belonging. In adulthood, they can revise a cherished idea without experiencing that revision as the loss of love or worth.',
        possible_meanings: [
          'Not knowing is the beginning of inquiry, not a personal failure.',
          'I can change my mind without losing my place among people I love.',
          'Respecting someone does not require pretending their explanation is correct.',
        ],
        reminder_cues: ['A claim is defended only by authority', 'Someone fears admitting uncertainty'],
        possible_initial_responses: ['May ask exploratory questions and state the limits of personal knowledge.'],
        possible_decision_tendencies: [
          'May seek contrary evidence and revise proposals rather than defend them as extensions of personal identity.',
        ],
        moderating_factors: ['Quality of available evidence', 'Recognizing the need for timely provisional choices'],
        alternative_outcome:
          'The character could mistake inquiry for endless deferral; a secure attitude toward being wrong also makes it possible to act provisionally and correct course.',
        source_ids: [],
      },
      {
        id: 'FE_P1008',
        valence: 'positive',
        title: 'Growing up dependent on neighbors with different beliefs and knowledge',
        domain: 'community_and_displacement',
        life_stages: ['childhood', 'adolescence'],
        exposure_pattern: 'extended_period',
        experience:
          'From ages eight to eighteen, the character grew up in an apartment building where families with different languages and beliefs shared childcare, repairs, and meals. A neighbor who struggled to read was skilled at fixing essential equipment; another who disagreed with the parents’ religion cared for the child during a long parental hospitalization. Each household contributed differently and could decline a request without losing its place. Over a decade, the character repeatedly saw that no single family possessed all the knowledge or resources needed for a good life. The contrast between inherited labels and actual relationships became a lasting reason to seek unfamiliar perspectives and voluntary cooperation.',
        possible_meanings: [
          'Someone I initially misunderstand may know exactly what we need.',
          'Differences in belief do not tell me whether a person will be kind or capable.',
          'Cooperation is strongest when people contribute freely, not because someone claims to own their obligation.',
        ],
        reminder_cues: [
          'A proposal excludes people unfamiliar to the group',
          'Someone’s contribution is dismissed because of status or belief',
        ],
        possible_initial_responses: ['May ask what overlooked knowledge or constraints a person brings.'],
        possible_decision_tendencies: [
          'May build voluntary partnerships across differences and adjust plans to people’s actual capacities.',
        ],
        moderating_factors: [
          'Clear boundaries and communication',
          'Distinguishing openness from ignoring evidence of harmful conduct',
        ],
        alternative_outcome:
          'The character could idealize every collaboration; the neighbors’ ordinary disagreements provide a model for revising arrangements and allowing people to opt out.',
        source_ids: [],
      },
    ],
    traits: [
      {
        name: 'open-mindedness',
        level: 'high',
        effect: 'Can revise cherished ideas without treating contrary evidence or a differing belief as rejection.',
        valence: 'positive',
      },
      {
        name: 'cooperativeness',
        level: 'high',
        effect:
          'Builds voluntary partnerships across differences while respecting each person’s limits and right to decline.',
        valence: 'positive',
      },
      {
        name: 'curiosity',
        level: 'high',
        effect:
          'Seeks unfamiliar knowledge and asks genuine questions rather than using inquiry to defend a predetermined answer.',
        valence: 'positive',
      },
    ],
    worldview: {
      viewOfPeople:
        'People hold different pieces of knowledge and can care for one another without sharing every belief.',
      viewOfSelf:
        'A fallible learner whose worth does not depend on certainty and whose abilities do not make others’ contributions unnecessary.',
      viewOfLife:
        'Life is an ongoing effort to understand and cooperate, with room to act, learn, and revise without demanding conformity.',
      beliefAboutGodAndAfterlife:
        'Agnostic about God and an afterlife after questioning the family’s religious beliefs in adolescence. Does not equate uncertainty with superior intelligence or believers with closed-mindedness, and remains comfortable collaborating with people of faith.',
    },
  }),
  // The courageous defender.
  new Personality({
    formativeExperiences: [
      {
        id: 'FE_N1014',
        valence: 'negative',
        title: 'An older sibling’s abuse was hidden to protect an authority figure',
        domain: 'interpersonal_safety',
        life_stages: ['childhood', 'adolescence'],
        exposure_pattern: 'extended_period',
        experience:
          'When the character was nine, an older sibling disclosed repeated abuse by a respected youth leader. Several adults pressured the sibling to stay silent to protect the organization, and the child watched trust in familiar adults collapse. An aunt believed the sibling, helped the family leave, and supported reporting without making the sibling recount the experience publicly. Over the following years, the character saw both the lasting harm of institutional silence and the difference made by someone who accepted social costs to protect a person rather than a reputation. As an adult, they remain alert to demands that vulnerable people sacrifice their safety for an authority’s good name.',
        possible_meanings: [
          'An admired title does not make someone safe or entitled to unquestioned trust.',
          'Silence can protect the person causing harm, not the person harmed.',
          'Defending someone means listening to their choices, not turning their pain into my public cause.',
        ],
        reminder_cues: [
          'A leader asks a harmed member to remain silent',
          'A complaint is dismissed to protect an institution',
        ],
        possible_initial_responses: [
          'May ask privately what support is wanted and look for a safe way to challenge the coercion.',
        ],
        possible_decision_tendencies: [
          'May support independent review, removal of abusive authority, and protection against retaliation.',
        ],
        moderating_factors: [
          'Safety and wishes of the affected person',
          'Distinguishing credible concerns from assumptions driven by the old history',
        ],
        alternative_outcome:
          'The experience could lead to indiscriminate suspicion or silence; the aunt’s example supports evidence-sensitive courage and respect for the affected person’s agency.',
        source_ids: [],
      },
      {
        id: 'FE_P1010',
        valence: 'positive',
        title: 'A decade of seeing faith paired with the right to say no',
        domain: 'family_and_caregiving',
        life_stages: ['childhood', 'adolescence'],
        exposure_pattern: 'extended_period',
        experience:
          'From ages ten to nineteen, the character’s aunt provided a reliable home where refusing affection, questioning an adult, or declining participation was not punished. She practiced her faith openly but distinguished devotion to God from obedience to a particular leader and helped the children find a community willing to acknowledge wrongdoing. The character repeatedly saw her challenge powerful people without dehumanizing them and maintain boundaries even when relatives called her difficult. Through daily practice, the character learned that a firm refusal can preserve dignity and that defending another person does not give the defender permission to control them.',
        possible_meanings: [
          'A person’s no remains meaningful even when an authority dislikes it.',
          'Faith and conscience can require challenging a leader rather than obeying one.',
          'I can be firm without reproducing domination.',
        ],
        reminder_cues: [
          'A member is told their consent cannot be withdrawn',
          'Someone invokes faith or duty to override a boundary',
        ],
        possible_initial_responses: ['May state the boundary clearly, seek allies, and offer a safe route out.'],
        possible_decision_tendencies: [
          'May defend revocation and voluntary participation even when doing so risks personal standing.',
        ],
        moderating_factors: [
          'Available allies and protection from retaliation',
          'Choosing a proportionate response rather than confrontation for its own sake',
        ],
        alternative_outcome:
          'Without attention to risk, courage could become reckless confrontation; the aunt’s patient planning supports assertiveness that actually improves safety.',
        source_ids: [],
      },
    ],
    traits: [
      {
        name: 'courage',
        level: 'high',
        effect:
          'Challenges abusive authority despite social costs rather than protecting a reputation at someone else’s expense.',
        valence: 'positive',
      },
      {
        name: 'empathy',
        level: 'high',
        effect:
          'Listens to affected people and avoids using their suffering to claim a heroic role or take over their decisions.',
        valence: 'positive',
      },
      {
        name: 'assertiveness',
        level: 'high',
        effect: 'States boundaries clearly and defends refusal and revocation without trying to dominate others.',
        valence: 'positive',
      },
    ],
    worldview: {
      viewOfPeople:
        'People deserve safety and agency regardless of status; admired leaders remain fallible and vulnerable people must not carry the cost of protecting them.',
      viewOfSelf:
        'An ally responsible for standing beside people, not a rescuer entitled to choose their lives for them.',
      viewOfLife:
        'Life calls for defending dignity through courageous, proportionate action and refusing to confuse loyalty with silence.',
      beliefAboutGodAndAfterlife:
        'Believes in a just and merciful God and an afterlife in which hidden wrongdoing matters. Understands faith as responsibility to protect the vulnerable and follow conscience, not as a requirement to obey religious or secular authorities unconditionally.',
    },
  }),
];
