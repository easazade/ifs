// Explicit item shape keeps generated member histories type-safe.
export type FormativeExperience = {
  id: `FE_${'N' | 'P'}${number}`;
  valence: 'negative' | 'positive';
  title: string;
  domain:
    | 'agency_and_mastery'
    | 'beliefs_and_authority'
    | 'caregiving_and_responsibility'
    | 'community_and_displacement'
    | 'emotion_and_coping'
    | 'family_and_caregiving'
    | 'health_and_physical_safety'
    | 'identity_and_inclusion'
    | 'institutional_trust'
    | 'interpersonal_safety'
    | 'loss_and_separation'
    | 'material_security'
    | 'moral_conflict'
    | 'peer_and_school'
    | 'trust_and_belonging'
    | 'work_and_achievement';
  life_stages: ('early_childhood' | 'childhood' | 'adolescence' | 'adulthood')[];
  exposure_pattern: 'single_event' | 'repeated' | 'extended_period';
  experience: string;
  possible_meanings: string[];
  reminder_cues: string[];
  possible_initial_responses: string[];
  possible_decision_tendencies: string[];
  moderating_factors: string[];
  alternative_outcome: string;
  source_ids: `S${number}`[];
};

export const formativeExperiences: FormativeExperience[] = [
  {
    id: 'FE_N001',
    valence: 'negative',
    title: 'Punished for expressing disagreement',
    domain: 'family_and_caregiving',
    life_stages: ['childhood', 'adolescence'],
    exposure_pattern: 'repeated',
    experience: 'A caregiver repeatedly mocked or punished the child for respectfully expressing a different opinion.',
    possible_meanings: ['Disagreement risks losing affection.', 'Keeping my views private is safer.'],
    reminder_cues: ['An authority figure demands agreement', 'A tense public discussion'],
    possible_initial_responses: [
      'May struggle to speak despite having an opinion.',
      'May agree aloud and object later in private.',
    ],
    possible_decision_tendencies: [
      'May abstain in a public vote despite privately opposing the proposal.',
      'May request an anonymous ballot before expressing dissent.',
    ],
    moderating_factors: ['Whether disagreement is actually safe now', 'Presence of a trusted ally'],
    alternative_outcome:
      'Later experiences of respectful debate may support confident disagreement without erasing the memory.',
    source_ids: ['S02', 'S03', 'S13'],
  },
  {
    id: 'FE_N002',
    valence: 'negative',
    title: 'Physical violence from a caregiver',
    domain: 'family_and_caregiving',
    life_stages: ['childhood', 'adolescence'],
    exposure_pattern: 'repeated',
    experience: 'A caregiver repeatedly hit the child during conflicts, making home physically unsafe.',
    possible_meanings: ['An angry person may hurt me.', 'I need to notice warning signs early.'],
    reminder_cues: ['A hand raised during an argument', 'Someone blocks the doorway'],
    possible_initial_responses: [
      "May become still and watch the person's movements.",
      'May move away or become sharply defensive.',
    ],
    possible_decision_tendencies: [
      'May leave a discussion when intimidation appears.',
      'May prioritize enforceable protections against coercion.',
    ],
    moderating_factors: ['Whether danger is ongoing', 'Access to safety and supportive relationships'],
    alternative_outcome:
      'The member may remain comfortable with calm disagreement and react mainly to specific threat cues.',
    source_ids: ['S02', 'S03', 'S04'],
  },
  {
    id: 'FE_N003',
    valence: 'negative',
    title: 'Witnessed violence between caregivers',
    domain: 'family_and_caregiving',
    life_stages: ['childhood', 'adolescence'],
    exposure_pattern: 'repeated',
    experience: 'The child repeatedly witnessed one caregiver threaten or assault another and could not stop it.',
    possible_meanings: ['Arguments can become dangerous quickly.', 'I should intervene before conflict escalates.'],
    reminder_cues: ['Raised voices between close companions', 'Someone threatens a partner'],
    possible_initial_responses: [
      'May monitor everyone closely and attempt to mediate.',
      'May withdraw because intervention once felt dangerous.',
    ],
    possible_decision_tendencies: [
      'May support clear conflict procedures.',
      'May compromise too early to end an escalating dispute.',
    ],
    moderating_factors: [
      'Whether a safe adult offered protection',
      'Similarity between the present conflict and past violence',
    ],
    alternative_outcome:
      'The person may learn to distinguish disagreement from violence and participate firmly in safe conflicts.',
    source_ids: ['S02', 'S03'],
  },
  {
    id: 'FE_N004',
    valence: 'negative',
    title: 'Emotional needs repeatedly ignored',
    domain: 'family_and_caregiving',
    life_stages: ['early_childhood', 'childhood'],
    exposure_pattern: 'extended_period',
    experience: 'Caregivers routinely ignored bids for comfort even when food and shelter were available.',
    possible_meanings: ['My feelings will not matter to others.', 'I should handle distress alone.'],
    reminder_cues: ['Being asked to describe personal needs', 'A delayed reply after asking for help'],
    possible_initial_responses: [
      'May minimize distress and say they are fine.',
      'May retreat before learning whether support is available.',
    ],
    possible_decision_tendencies: [
      'May avoid requesting an accommodation they need.',
      'May favor independent arrangements over relying on others.',
    ],
    moderating_factors: ['Whether someone now responds consistently', 'Their experiences with help outside the family'],
    alternative_outcome: 'A reliable later relationship may make asking for support ordinary rather than threatening.',
    source_ids: ['S02', 'S03'],
  },
  {
    id: 'FE_N005',
    valence: 'negative',
    title: 'Basic needs persistently unmet',
    domain: 'material_security',
    life_stages: ['early_childhood', 'childhood', 'adolescence'],
    exposure_pattern: 'extended_period',
    experience:
      "The child repeatedly lacked necessary supervision, clothing, or medical attention, whatever the household's resources.",
    possible_meanings: ['Essential needs can be overlooked.', 'I need a backup plan for myself.'],
    reminder_cues: ['Dependence on a shared service', 'Someone dismisses an essential expense'],
    possible_initial_responses: [
      'May check practical arrangements repeatedly.',
      'May become upset when basic provisions are treated as optional.',
    ],
    possible_decision_tendencies: [
      'May protect essential services before discretionary projects.',
      'May resist plans that rely on an untested caretaker.',
    ],
    moderating_factors: ['Reasons the needs went unmet', 'Current access to reliable care and resources'],
    alternative_outcome: 'The member may become a practical planner without developing broad distrust of people.',
    source_ids: ['S01', 'S02'],
  },
  {
    id: 'FE_N006',
    valence: 'negative',
    title: 'Caregiver availability changed unpredictably',
    domain: 'family_and_caregiving',
    life_stages: ['early_childhood', 'childhood', 'adolescence'],
    exposure_pattern: 'extended_period',
    experience:
      'During periods of caregiver impairment, promised care and pickups repeatedly failed without reliable replacement support.',
    possible_meanings: [
      'A promise does not guarantee someone will arrive.',
      'I must monitor whether others are available.',
    ],
    reminder_cues: ['An important person becomes unreachable', "Plans depend on one person's reliability"],
    possible_initial_responses: ['May seek repeated confirmation.', 'May take over arrangements rather than wait.'],
    possible_decision_tendencies: [
      'May insist on backup decision makers.',
      'May prefer a less exciting proposal with dependable delivery.',
    ],
    moderating_factors: ['Availability of another consistent caregiver', 'Whether later promises have been kept'],
    alternative_outcome:
      'They may trust individuals with a reliable record while remaining cautious about unsupported promises.',
    source_ids: ['S01', 'S03'],
  },
  {
    id: 'FE_N007',
    valence: 'negative',
    title: 'Forced to manage adult responsibilities too early',
    domain: 'family_and_caregiving',
    life_stages: ['childhood', 'adolescence'],
    exposure_pattern: 'extended_period',
    experience:
      'The child had to manage siblings and household crises beyond their age while their own needs received little attention.',
    possible_meanings: [
      'Things fall apart unless I take charge.',
      'My needs must wait until everyone else is settled.',
    ],
    reminder_cues: ['Others appear disorganized', 'Someone asks them to take one more responsibility'],
    possible_initial_responses: [
      'May volunteer automatically despite exhaustion.',
      'May feel irritated when others do not notice the burden.',
    ],
    possible_decision_tendencies: [
      'May accept an unsustainable leadership role.',
      'May resist delegating tasks whose failure would affect dependents.',
    ],
    moderating_factors: [
      'Whether responsibility was chosen or imposed',
      'Availability of reliable help and boundaries',
    ],
    alternative_outcome:
      'They may retain competence while learning to share responsibility and refuse excessive demands.',
    source_ids: ['S03'],
  },
  {
    id: 'FE_N008',
    valence: 'negative',
    title: 'Affection depended on achievement',
    domain: 'family_and_caregiving',
    life_stages: ['childhood', 'adolescence'],
    exposure_pattern: 'repeated',
    experience: 'A caregiver became warm after high performance and distant after ordinary mistakes or lower grades.',
    possible_meanings: ['I must excel to remain valued.', 'A visible mistake could cost me belonging.'],
    reminder_cues: ['Rankings or performance reviews', 'A task with uncertain chances of success'],
    possible_initial_responses: [
      'May overprepare and hide difficulty.',
      'May avoid attempting something they cannot immediately do well.',
    ],
    possible_decision_tendencies: [
      'May choose a prestigious role over a satisfying one.',
      'May oppose experiments that could expose personal failure.',
    ],
    moderating_factors: [
      'Whether relationships now remain stable through setbacks',
      'How much identity depends on achievement',
    ],
    alternative_outcome: "Success and affection may gradually become separate in the person's self-understanding.",
    source_ids: ['S03', 'S09', 'S13'],
  },
  {
    id: 'FE_N009',
    valence: 'negative',
    title: 'Repeated unfavorable comparison with a sibling',
    domain: 'family_and_caregiving',
    life_stages: ['childhood', 'adolescence'],
    exposure_pattern: 'repeated',
    experience: "Family members repeatedly praised a sibling while describing the child's contributions as inferior.",
    possible_meanings: [
      'Recognition is scarce and someone else gets it.',
      'I have to distinguish myself to be noticed.',
    ],
    reminder_cues: ['Unequal public praise', 'Two people are compared for one position'],
    possible_initial_responses: [
      'May feel overlooked even before the criteria are explained.',
      'May compete intensely or stop participating.',
    ],
    possible_decision_tendencies: [
      'May scrutinize how credit and opportunities are allocated.',
      'May reject a collaborative role if it seems invisible.',
    ],
    moderating_factors: ['Fairness of the current comparison', 'Recognition received in other relationships'],
    alternative_outcome: 'They may value fair recognition without viewing colleagues as rivals.',
    source_ids: ['S03', 'S13'],
  },
  {
    id: 'FE_N010',
    valence: 'negative',
    title: 'Caregiver left without a clear explanation',
    domain: 'loss_and_separation',
    life_stages: ['childhood', 'adolescence'],
    exposure_pattern: 'single_event',
    experience:
      'A caregiver suddenly stopped contact and the child received little reliable explanation or reassurance.',
    possible_meanings: ['People can disappear without warning.', 'Their departure might somehow be my fault.'],
    reminder_cues: ["A close person's unexplained silence", 'Sudden changes to contact arrangements'],
    possible_initial_responses: [
      'May urgently seek reassurance.',
      'May detach first to avoid anticipating another loss.',
    ],
    possible_decision_tendencies: [
      'May prefer explicit commitments and exit terms.',
      'May hesitate to invest in a new alliance.',
    ],
    moderating_factors: ['Age and explanations available at the time', 'Dependability of remaining relationships'],
    alternative_outcome:
      "With reliable support, the departure may be understood as the adult's action rather than a measure of personal worth.",
    source_ids: ['S02', 'S03'],
  },
  {
    id: 'FE_N011',
    valence: 'negative',
    title: "Caught in caregivers' hostile separation",
    domain: 'loss_and_separation',
    life_stages: ['childhood', 'adolescence'],
    exposure_pattern: 'extended_period',
    experience: 'During a separation, caregivers repeatedly asked the child to take sides and carry hostile messages.',
    possible_meanings: ['Caring about one person betrays another.', 'I am responsible for keeping both sides calm.'],
    reminder_cues: ['Friends demand exclusive loyalty', 'Two factions ask for private information'],
    possible_initial_responses: [
      'May conceal preferences or tell each side what it wants to hear.',
      'May avoid choosing at all.',
    ],
    possible_decision_tendencies: [
      'May abstain when a vote is framed as personal loyalty.',
      'May advocate procedures that reduce factional pressure.',
    ],
    moderating_factors: [
      'Whether adults later removed the child from the conflict',
      'Freedom to maintain independent relationships',
    ],
    alternative_outcome:
      'The person may become comfortable caring about opposing people without serving as their mediator.',
    source_ids: ['S01', 'S03'],
  },
  {
    id: 'FE_N012',
    valence: 'negative',
    title: 'Sudden death of a close person',
    domain: 'loss_and_separation',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'single_event',
    experience: "Someone important died unexpectedly, disrupting daily life and the person's sense of continuity.",
    possible_meanings: ['Time with people is uncertain.', 'Plans can change without warning.'],
    reminder_cues: ['An anniversary or familiar place', 'An unexpected call about a loved one'],
    possible_initial_responses: ['May become sad or distracted.', 'May seek closeness or temporarily need solitude.'],
    possible_decision_tendencies: [
      'May prioritize time with loved ones over extra work.',
      'May become cautious about plans that separate them from support.',
    ],
    moderating_factors: ['Circumstances of the death', 'Time, cultural mourning practices, and available support'],
    alternative_outcome:
      'Grief may coexist with ordinary decision making and need not produce a lasting threat response.',
    source_ids: ['S02', 'S04'],
  },
  {
    id: 'FE_N013',
    valence: 'negative',
    title: "Prolonged uncertainty about a loved one's safety",
    domain: 'loss_and_separation',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'extended_period',
    experience:
      'A loved one was missing or unreachable during a crisis, leaving the person without clear information for a long period.',
    possible_meanings: ['Uncertainty itself can be unbearable.', 'Stopping the search might mean abandoning someone.'],
    reminder_cues: ['Conflicting reports during an emergency', 'No clear update about an absent person'],
    possible_initial_responses: [
      'May repeatedly check messages and news.',
      'May find it difficult to focus on unrelated matters.',
    ],
    possible_decision_tendencies: [
      'May demand frequent status updates.',
      'May postpone a decision until missing information arrives.',
    ],
    moderating_factors: ['Whether uncertainty continues', 'Access to dependable information and companionship'],
    alternative_outcome:
      'They may develop a workable tolerance for uncertainty while retaining strong preferences for communication.',
    source_ids: ['S02', 'S04'],
  },
  {
    id: 'FE_N014',
    valence: 'negative',
    title: 'Friend repeatedly disclosed private information',
    domain: 'trust_and_belonging',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'repeated',
    experience: 'A trusted friend shared personal disclosures with others despite promises of confidentiality.',
    possible_meanings: [
      'Private information can be used against me.',
      'Trust should be tested before I disclose more.',
    ],
    reminder_cues: ['A request for sensitive information', 'Gossip presented as harmless entertainment'],
    possible_initial_responses: [
      'May become guarded or ask who will see the information.',
      'May confront the breach directly.',
    ],
    possible_decision_tendencies: [
      'May oppose unnecessary collection of member data.',
      'May disclose only what a task genuinely requires.',
    ],
    moderating_factors: ['Accountability after the breach', 'Experience with people who respect confidentiality'],
    alternative_outcome: 'The person may set clear privacy boundaries without avoiding emotional closeness altogether.',
    source_ids: ['S11'],
  },
  {
    id: 'FE_N015',
    valence: 'negative',
    title: 'Repeated peer bullying',
    domain: 'peer_and_school',
    life_stages: ['childhood', 'adolescence'],
    exposure_pattern: 'repeated',
    experience: 'Peers repeatedly intimidated or humiliated the person while they had limited power to stop it.',
    possible_meanings: ['A group may turn against me.', 'Standing out may make me a target.'],
    reminder_cues: ['Whispering or laughter during their turn to speak', 'A group singles out one member'],
    possible_initial_responses: [
      'May become quiet and scan reactions.',
      'May respond defensively before the intent is clear.',
    ],
    possible_decision_tendencies: [
      'May avoid highly visible roles.',
      'May support safeguards for members with less social power.',
    ],
    moderating_factors: ['Whether bystanders intervened', 'Current group norms and trusted peers'],
    alternative_outcome: 'A supportive group may allow visibility to feel rewarding rather than dangerous.',
    source_ids: ['S02', 'S03'],
  },
  {
    id: 'FE_N016',
    valence: 'negative',
    title: 'Excluded from a valued peer group',
    domain: 'peer_and_school',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'extended_period',
    experience:
      'A group important to the person repeatedly omitted them from invitations and decisions without explanation.',
    possible_meanings: ['I may not really belong here.', 'I must work harder to remain included.'],
    reminder_cues: ['Learning about a meeting after it happened', 'An unanswered invitation'],
    possible_initial_responses: ['May seek signs of acceptance.', 'May withdraw to avoid another rejection.'],
    possible_decision_tendencies: [
      'May agree with a majority to protect membership.',
      'May favor transparent participation rules.',
    ],
    moderating_factors: ['Whether exclusion was intentional', 'Belonging available in other groups'],
    alternative_outcome:
      "They may find a more compatible community and stop treating this group's approval as essential.",
    source_ids: ['S05', 'S07', 'S14'],
  },
  {
    id: 'FE_N017',
    valence: 'negative',
    title: 'Public humiliation by a teacher',
    domain: 'peer_and_school',
    life_stages: ['childhood', 'adolescence'],
    exposure_pattern: 'single_event',
    experience:
      'A teacher ridiculed an incorrect answer in front of classmates, turning a learning attempt into public embarrassment.',
    possible_meanings: ['Asking or answering questions can expose me.', 'Authority may use my mistakes against me.'],
    reminder_cues: ['Being called on without preparation', 'A knowledgeable person laughs at an error'],
    possible_initial_responses: ['May go blank or avoid eye contact.', 'May prepare excessively before contributing.'],
    possible_decision_tendencies: [
      'May withhold useful questions in meetings.',
      'May prefer written input where there is time to compose a response.',
    ],
    moderating_factors: ['Whether the teacher repaired the harm', 'Later experiences with patient instruction'],
    alternative_outcome: 'The person may regain confidence in learning environments that welcome uncertainty.',
    source_ids: ['S03', 'S09'],
  },
  {
    id: 'FE_N018',
    valence: 'negative',
    title: 'Learning difficulties treated as laziness',
    domain: 'peer_and_school',
    life_stages: ['childhood', 'adolescence'],
    exposure_pattern: 'repeated',
    experience:
      'The person struggled with a particular task and was repeatedly blamed instead of receiving an explanation or appropriate support.',
    possible_meanings: ['Effort may not be visible to others.', 'Asking for help invites judgment.'],
    reminder_cues: ['Being told a task should be easy', 'A deadline without accessible instructions'],
    possible_initial_responses: [
      'May hide confusion and delay starting.',
      'May react strongly to assumptions about motivation.',
    ],
    possible_decision_tendencies: [
      'May avoid roles that expose the unsupported difficulty.',
      'May support clear instructions and accessible participation.',
    ],
    moderating_factors: ['Whether the difficulty is now understood', 'Fit between the task and available support'],
    alternative_outcome:
      'Appropriate support may reveal strong ability and change expectations of what they can achieve.',
    source_ids: ['S03', 'S09'],
  },
  {
    id: 'FE_N019',
    valence: 'negative',
    title: 'Punished for asking sincere questions',
    domain: 'beliefs_and_authority',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'repeated',
    experience:
      'An authority in a family, school, religious, or political setting treated sincere questions as disloyalty and imposed penalties.',
    possible_meanings: ['Curiosity can threaten belonging.', 'Public agreement may be safer than honest uncertainty.'],
    reminder_cues: ['A claim that cannot be questioned', 'Demands to prove loyalty before discussion'],
    possible_initial_responses: [
      'May hide doubts while appearing agreeable.',
      'May become openly resistant to demands for unquestioning obedience.',
    ],
    possible_decision_tendencies: [
      'May request independent evidence privately.',
      'May oppose rules that punish good-faith criticism.',
    ],
    moderating_factors: ['Freedom to leave the setting', 'Experiences with authorities who welcome questions'],
    alternative_outcome:
      'They may maintain or change their beliefs while developing a more open way of examining them.',
    source_ids: ['S03', 'S13', 'S16'],
  },
  {
    id: 'FE_N020',
    valence: 'negative',
    title: 'Harassment targeted an aspect of identity',
    domain: 'identity_and_inclusion',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'repeated',
    experience:
      'The person experienced threats or degrading treatment tied to an aspect of identity such as ethnicity, religion, gender, or disability.',
    possible_meanings: [
      'Some settings are unsafe for people perceived like me.',
      'I need to know whether allies will act.',
    ],
    reminder_cues: ['Degrading jokes about a group', 'Identity becomes the focus of an evaluation'],
    possible_initial_responses: [
      'May become watchful or limit disclosure.',
      'May object and seek support from others.',
    ],
    possible_decision_tendencies: [
      'May examine inclusion rules before joining a group.',
      'May prioritize enforceable protection from harassment.',
    ],
    moderating_factors: [
      'Actual safety and discrimination in the present setting',
      'Availability of affirming relationships',
    ],
    alternative_outcome: 'Confidence in supportive settings may coexist with justified caution in hostile ones.',
    source_ids: ['S02'],
  },
  {
    id: 'FE_N021',
    valence: 'negative',
    title: 'Repeated ridicule about appearance',
    domain: 'identity_and_inclusion',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'repeated',
    experience: "Others repeatedly mocked the person's body or appearance and tied their worth to those judgments.",
    possible_meanings: ['Being visible means being evaluated.', 'Acceptance depends on how I look.'],
    reminder_cues: ['Uninvited comments about appearance', 'Being photographed or placed on stage'],
    possible_initial_responses: [
      'May become self-conscious and withdraw.',
      'May defensively dismiss appearance-related discussion.',
    ],
    possible_decision_tendencies: [
      'May decline public representation despite relevant skill.',
      'May prefer selection criteria unrelated to appearance.',
    ],
    moderating_factors: ['Their own interpretation of the comments', 'Relationships that value them beyond appearance'],
    alternative_outcome: 'The person may reject those judgments and develop comfortable visibility on their own terms.',
    source_ids: ['S02', 'S03'],
  },
  {
    id: 'FE_N022',
    valence: 'negative',
    title: 'Sexual abuse by a trusted person',
    domain: 'interpersonal_safety',
    life_stages: ['childhood', 'adolescence'],
    exposure_pattern: 'repeated',
    experience:
      "A trusted person violated the child's sexual boundaries and used secrecy or power to prevent disclosure.",
    possible_meanings: ['Someone close can violate my boundaries.', 'Telling others may feel dangerous.'],
    reminder_cues: ['Pressure to keep an uncomfortable secret', 'Unwanted closeness from someone with power'],
    possible_initial_responses: [
      'May freeze, withdraw, or become very alert.',
      'May seek distance and clearly assert a boundary.',
    ],
    possible_decision_tendencies: [
      'May require explicit consent and oversight in sensitive settings.',
      'May avoid situations that leave them isolated with an authority.',
    ],
    moderating_factors: [
      'Whether safety and belief followed disclosure',
      'Current control over boundaries and access to support',
    ],
    alternative_outcome:
      'Many areas of trust and intimacy may remain intact or recover; this history does not define sexuality, morality, or future conduct.',
    source_ids: ['S02', 'S03', 'S04'],
  },
  {
    id: 'FE_N023',
    valence: 'negative',
    title: 'Disclosure of harm was dismissed',
    domain: 'institutional_trust',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'single_event',
    experience:
      'After reporting serious mistreatment, the person was dismissed or blamed by someone responsible for helping.',
    possible_meanings: ['Asking for protection may make things worse.', 'I need evidence before anyone will listen.'],
    reminder_cues: ['An official minimizes a complaint', 'Being asked why they did not act sooner'],
    possible_initial_responses: [
      'May stop explaining and disengage.',
      'May document details carefully before speaking again.',
    ],
    possible_decision_tendencies: [
      'May prefer independent complaint channels.',
      'May hesitate to report a problem through the same hierarchy.',
    ],
    moderating_factors: [
      'Whether a later responder took the report seriously',
      'Independence and conduct of the current institution',
    ],
    alternative_outcome:
      'A credible response may rebuild trust in specific people or procedures without requiring blanket trust.',
    source_ids: ['S03', 'S10', 'S15'],
  },
  {
    id: 'FE_N024',
    valence: 'negative',
    title: 'Experienced coercive control in a relationship',
    domain: 'interpersonal_safety',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'extended_period',
    experience: 'A partner monitored contact, restricted money, and punished independent choices over time.',
    possible_meanings: ['Dependence can be used to control me.', 'Ordinary choices may provoke retaliation.'],
    reminder_cues: [
      'Demands for passwords or constant location updates',
      'A partner or leader controls access to money',
    ],
    possible_initial_responses: [
      'May appease the other person to reduce immediate danger.',
      'May protect information and seek a safe way out.',
    ],
    possible_decision_tendencies: [
      'May insist on independent access to resources.',
      'May reject arrangements that concentrate unchecked personal control.',
    ],
    moderating_factors: ['Whether coercion is still ongoing', 'Practical access to safety, money, and trusted help'],
    alternative_outcome: 'They may build close relationships with shared power while preserving autonomy.',
    source_ids: ['S02', 'S04'],
  },
  {
    id: 'FE_N025',
    valence: 'negative',
    title: 'Assault in an ordinary public place',
    domain: 'interpersonal_safety',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'single_event',
    experience:
      'The person was assaulted while carrying out an everyday activity in a place they had previously considered safe.',
    possible_meanings: ['Danger can appear in routine situations.', 'I need to notice escape routes.'],
    reminder_cues: ['A place resembling the location', 'Unexpected movement behind them'],
    possible_initial_responses: [
      'May startle, scan the area, or move away.',
      'May seek company before returning to similar places.',
    ],
    possible_decision_tendencies: [
      'May give additional weight to transport and venue safety.',
      'May decline an otherwise attractive activity when it reproduces specific threat cues.',
    ],
    moderating_factors: ['Present safety conditions', 'Time, support, and subsequent safe experiences'],
    alternative_outcome:
      'Reactions may diminish and remain limited to particular reminders rather than all public spaces.',
    source_ids: ['S04'],
  },
  {
    id: 'FE_N026',
    valence: 'negative',
    title: 'Repeated exposure to neighborhood violence',
    domain: 'community_and_displacement',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'extended_period',
    experience:
      'Frequent nearby threats and violent incidents made daily routes and gatherings difficult to treat as safe.',
    possible_meanings: ['Safety depends on staying alert.', 'Formal protection may not arrive in time.'],
    reminder_cues: ['A sudden loud bang near a crowd', 'An unfamiliar group blocks a route'],
    possible_initial_responses: [
      'May watch exits and assess who is present.',
      'May reduce time spent in exposed locations.',
    ],
    possible_decision_tendencies: [
      'May prefer predictable meeting places and safe travel arrangements.',
      'May support local safety measures while scrutinizing who controls them.',
    ],
    moderating_factors: ['Whether the environment remains dangerous', 'Relationships with trustworthy local people'],
    alternative_outcome:
      'Vigilance may be an appropriate response to current conditions and can decrease when conditions change.',
    source_ids: ['S02', 'S04'],
  },
  {
    id: 'FE_N027',
    valence: 'negative',
    title: 'Displaced by armed conflict',
    domain: 'community_and_displacement',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'extended_period',
    experience:
      'Armed conflict forced the person to leave home, interrupt important relationships, and rebuild daily life elsewhere.',
    possible_meanings: [
      'A settled life can be lost through forces beyond my control.',
      'I need resources that remain useful if I must leave again.',
    ],
    reminder_cues: ['Threats of renewed conflict', 'Documents or housing status become uncertain'],
    possible_initial_responses: [
      'May focus on practical preparations.',
      'May feel grief or anger when others trivialize displacement.',
    ],
    possible_decision_tendencies: [
      'May value secure residence and portable savings.',
      'May favor plans that preserve family contact and access to documents.',
    ],
    moderating_factors: ['Security of the new location', 'Continuity of community and practical support'],
    alternative_outcome:
      'The person may develop a strong new sense of belonging while retaining connections to the place they left.',
    source_ids: ['S02', 'S04'],
  },
  {
    id: 'FE_N028',
    valence: 'negative',
    title: 'Survived a disaster that destroyed home',
    domain: 'community_and_displacement',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'single_event',
    experience: "A flood, earthquake, or fire destroyed the person's home and disrupted ordinary life.",
    possible_meanings: [
      'Material security can disappear suddenly.',
      'Preparation may matter more than I previously thought.',
    ],
    reminder_cues: ['Weather or emergency warnings', 'Being asked to store all resources in one place'],
    possible_initial_responses: [
      'May check supplies and contingency plans.',
      'May become distressed by sensory reminders of the disaster.',
    ],
    possible_decision_tendencies: [
      'May prioritize emergency reserves over short-term improvements.',
      'May support rebuilding with stronger safety standards.',
    ],
    moderating_factors: ['Losses and danger actually experienced', 'Quality of recovery support and current housing'],
    alternative_outcome: 'Preparedness may become a bounded habit without persistent fear in unrelated settings.',
    source_ids: ['S02', 'S04'],
  },
  {
    id: 'FE_N029',
    valence: 'negative',
    title: 'Serious road accident',
    domain: 'health_and_physical_safety',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'single_event',
    experience: 'The person survived a road accident involving serious injury or a credible threat to life.',
    possible_meanings: ['Routine travel can become dangerous.', 'I want some control over how I travel.'],
    reminder_cues: ['Sudden braking', 'A route or vehicle resembling the accident'],
    possible_initial_responses: [
      'May tense up, become quiet, or ask to stop.',
      'May prefer a trusted driver or another route.',
    ],
    possible_decision_tendencies: [
      'May weigh travel safety heavily in accepting an opportunity.',
      'May support realistic safety procedures even when inconvenient.',
    ],
    moderating_factors: ['Recovery from injury', 'Current driving conditions and later travel experiences'],
    alternative_outcome:
      'They may return to ordinary travel while retaining specific preferences about speed and safety.',
    source_ids: ['S04'],
  },
  {
    id: 'FE_N030',
    valence: 'negative',
    title: 'Frightening medical treatment with little explanation',
    domain: 'health_and_physical_safety',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'single_event',
    experience:
      'During urgent medical care, the person felt frightened and powerless because procedures were painful or poorly explained.',
    possible_meanings: ['Medical settings may take away my control.', 'I need to understand before I can cooperate.'],
    reminder_cues: ['An unexplained procedure', 'Being rushed to consent'],
    possible_initial_responses: [
      'May become tense or unable to ask questions.',
      'May demand more information or delay agreement.',
    ],
    possible_decision_tendencies: [
      'May prioritize informed consent and communication in service choices.',
      'May avoid a useful service if it recreates helplessness.',
    ],
    moderating_factors: [
      'Medical urgency and actual options',
      'Whether later clinicians provide respectful explanations',
    ],
    alternative_outcome:
      'A clinician who explains choices may help the person use care confidently while acknowledging the earlier experience.',
    source_ids: ['S02', 'S04'],
  },
  {
    id: 'FE_N031',
    valence: 'negative',
    title: 'Persistent symptoms repeatedly dismissed',
    domain: 'health_and_physical_safety',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'repeated',
    experience:
      'The person sought help for persistent symptoms but repeatedly felt unheard and left without a workable explanation or plan.',
    possible_meanings: [
      'I may have to fight to have my experience considered.',
      'Professional confidence does not guarantee understanding.',
    ],
    reminder_cues: ['A specialist interrupts their account', 'A complaint is dismissed without assessment'],
    possible_initial_responses: [
      'May bring extensive records and emphasize details.',
      'May disengage from another consultation.',
    ],
    possible_decision_tendencies: [
      'May seek second opinions and transparent reasoning.',
      "May question expert recommendations that omit affected people's accounts.",
    ],
    moderating_factors: [
      'Whether appropriate assessment and care followed',
      'Quality of the present professional interaction',
    ],
    alternative_outcome: 'They may remain receptive to expertise while expecting evidence and respectful listening.',
    source_ids: ['S04'],
  },
  {
    id: 'FE_N032',
    valence: 'negative',
    title: 'Recurrent food insecurity',
    domain: 'material_security',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'extended_period',
    experience:
      'The household repeatedly did not know whether enough food would be available before the next income or aid payment.',
    possible_meanings: ['Essential supplies may run out.', 'Waste is dangerous when the next delivery is uncertain.'],
    reminder_cues: ['A nearly empty cupboard', 'A shared budget cuts food provision'],
    possible_initial_responses: [
      'May stock up when resources become available.',
      'May feel uneasy when others spend essentials casually.',
    ],
    possible_decision_tendencies: [
      'May prioritize reliable basic provision over optional benefits.',
      'May keep a larger reserve than other members consider necessary.',
    ],
    moderating_factors: ['Current food security', 'Control over income and access to dependable assistance'],
    alternative_outcome: 'Stable access may reduce urgency while leaving a practical preference for avoiding waste.',
    source_ids: ['S01', 'S12'],
  },
  {
    id: 'FE_N033',
    valence: 'negative',
    title: 'Eviction and repeated temporary housing',
    domain: 'material_security',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'extended_period',
    experience:
      'After losing housing, the person moved between temporary places with little control over how long they could stay.',
    possible_meanings: [
      "A place to live can depend on someone else's decision.",
      'Long-term plans need a secure base.',
    ],
    reminder_cues: ['A rent increase or uncertain renewal', 'Being told an arrangement is only temporary'],
    possible_initial_responses: [
      'May urgently seek written assurances.',
      'May keep belongings packed or avoid becoming attached to a place.',
    ],
    possible_decision_tendencies: [
      'May choose stability over a more rewarding but precarious opportunity.',
      'May favor reliable housing support in a shared budget.',
    ],
    moderating_factors: [
      'Current legal and financial housing security',
      'Availability of people who can help without imposing control',
    ],
    alternative_outcome: 'Once securely housed, the person may regain comfort with long-term commitments.',
    source_ids: ['S01', 'S12'],
  },
  {
    id: 'FE_N034',
    valence: 'negative',
    title: 'Humiliated for needing financial help',
    domain: 'material_security',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'repeated',
    experience:
      'Requests for necessities were met with public shame or comments that portrayed the person as inferior.',
    possible_meanings: ['Asking for help exposes me to humiliation.', 'I must hide financial difficulty.'],
    reminder_cues: [
      'A public discussion of who receives assistance',
      'An application asks for personal hardship details',
    ],
    possible_initial_responses: ['May decline needed help.', 'May become defensive about money.'],
    possible_decision_tendencies: [
      'May prefer confidential, universal access over public charity.',
      'May conceal a constraint that affects their ability to participate.',
    ],
    moderating_factors: [
      'Privacy and respect in the current offer',
      'Availability of support without strings attached',
    ],
    alternative_outcome: 'Respectful assistance may separate accepting help from feelings of inferiority.',
    source_ids: ['S01', 'S12'],
  },
  {
    id: 'FE_N035',
    valence: 'negative',
    title: 'Abrupt involuntary job loss',
    domain: 'work_and_achievement',
    life_stages: ['adulthood'],
    exposure_pattern: 'single_event',
    experience:
      'The person lost a job unexpectedly and had to reorganize finances and daily identity with little preparation.',
    possible_meanings: ['Loyalty does not guarantee security.', 'My future needs more than one source of support.'],
    reminder_cues: ['Rumors of restructuring', 'An unexplained meeting with management'],
    possible_initial_responses: [
      'May worry and review finances immediately.',
      'May emotionally distance themselves from the employer.',
    ],
    possible_decision_tendencies: [
      'May prefer a safer contract over higher uncertain pay.',
      'May support emergency funds and transparent termination procedures.',
    ],
    moderating_factors: [
      'Financial reserves and dependents',
      'Access to alternative work and supportive relationships',
    ],
    alternative_outcome:
      'A later secure role or chosen career change may restore confidence and make the loss a bounded chapter.',
    source_ids: ['S12'],
  },
  {
    id: 'FE_N036',
    valence: 'negative',
    title: 'Repeated rejection after substantial effort',
    domain: 'work_and_achievement',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'repeated',
    experience:
      'The person repeatedly invested effort in applications or projects and received rejection with little useful feedback.',
    possible_meanings: ['Effort may not change the outcome.', 'I do not know what evaluators want.'],
    reminder_cues: ['Another opaque selection process', 'Encouragement without practical feedback'],
    possible_initial_responses: ['May delay trying again.', 'May search intensely for a controllable strategy.'],
    possible_decision_tendencies: [
      'May favor opportunities with explicit criteria.',
      'May avoid an uncertain bid despite adequate ability.',
    ],
    moderating_factors: [
      'Whether rejection reflects fit, access, or performance',
      'Quality of feedback and subsequent opportunities',
    ],
    alternative_outcome:
      "A clear route to improvement may restore persistence without implying that previous rejection was the person's fault.",
    source_ids: ['S09', 'S12'],
  },
  {
    id: 'FE_N037',
    valence: 'negative',
    title: 'Manager took credit for their work',
    domain: 'work_and_achievement',
    life_stages: ['adulthood'],
    exposure_pattern: 'repeated',
    experience:
      "A manager repeatedly presented the person's contributions as their own and denied the contributor recognition.",
    possible_meanings: [
      'Work can be appropriated by people with power.',
      'I need a visible record of my contribution.',
    ],
    reminder_cues: ['Vague ownership of a project', 'A superior presents results without naming contributors'],
    possible_initial_responses: [
      'May document authorship carefully.',
      'May become reluctant to share unfinished ideas.',
    ],
    possible_decision_tendencies: [
      'May require clear credit and ownership agreements.',
      'May decline collaboration where accountability is weak.',
    ],
    moderating_factors: ['Availability of fair review or recourse', 'Whether new collaborators share credit reliably'],
    alternative_outcome: 'The person may collaborate freely in teams with transparent attribution.',
    source_ids: ['S11', 'S16'],
  },
  {
    id: 'FE_N038',
    valence: 'negative',
    title: 'Retaliation after reporting wrongdoing',
    domain: 'institutional_trust',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'single_event',
    experience:
      'After raising a legitimate concern, the person lost opportunities or experienced intimidation from those implicated.',
    possible_meanings: [
      'Reporting a problem can carry personal costs.',
      'Rules may protect the powerful unless independently enforced.',
    ],
    reminder_cues: [
      'A request to report directly to the accused leader',
      "Warnings about damaging the group's reputation",
    ],
    possible_initial_responses: [
      'May document concerns quietly.',
      'May become angry or reluctant to speak through official channels.',
    ],
    possible_decision_tendencies: [
      'May insist on protection for complainants.',
      'May seek an independent route before challenging leadership.',
    ],
    moderating_factors: ['Credibility of current protections', 'Personal exposure to retaliation and available allies'],
    alternative_outcome:
      'Successful accountability may rebuild confidence in specific procedures and collective action.',
    source_ids: ['S10', 'S15', 'S16'],
  },
  {
    id: 'FE_N039',
    valence: 'negative',
    title: 'Financial deception by someone trusted',
    domain: 'trust_and_belonging',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'single_event',
    experience: 'A trusted person misrepresented a financial arrangement and caused a meaningful loss.',
    possible_meanings: ['Personal warmth does not guarantee honesty.', 'I should verify terms independently.'],
    reminder_cues: ['Pressure to invest quickly', 'A request to rely on friendship instead of written terms'],
    possible_initial_responses: ['May become suspicious of urgency.', 'May seek records and outside advice.'],
    possible_decision_tendencies: [
      'May favor transparent accounts and independent checks.',
      'May decline informal pooling of money.',
    ],
    moderating_factors: ['Size and recoverability of the loss', 'Whether later transactions have been trustworthy'],
    alternative_outcome: "Careful verification may replace generalized suspicion as the person's main response.",
    source_ids: ['S11', 'S12'],
  },
  {
    id: 'FE_N040',
    valence: 'negative',
    title: 'Humiliating romantic rejection',
    domain: 'trust_and_belonging',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'single_event',
    experience: 'A vulnerable expression of affection was mocked or shared publicly rather than declined respectfully.',
    possible_meanings: [
      'Showing affection can expose me to ridicule.',
      'I should know the answer before revealing interest.',
    ],
    reminder_cues: [
      'Being asked about private feelings in a group',
      'A vulnerable invitation with an uncertain response',
    ],
    possible_initial_responses: [
      'May conceal feelings through humor or distance.',
      'May hesitate before initiating closeness.',
    ],
    possible_decision_tendencies: [
      'May avoid personal risks that require public vulnerability.',
      'May value confidentiality and a respectful way to decline.',
    ],
    moderating_factors: ['How important the relationship was', 'Later experiences of kind and respectful responses'],
    alternative_outcome: 'They may accept ordinary rejection comfortably once it is separated from public humiliation.',
    source_ids: ['S11'],
  },
  {
    id: 'FE_N041',
    valence: 'negative',
    title: 'A valued group expelled them for dissent',
    domain: 'beliefs_and_authority',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'single_event',
    experience:
      'After disagreeing with a leader, the person was excluded from a community central to their social life.',
    possible_meanings: ['Membership can depend on obedience.', 'I need relationships outside any one group.'],
    reminder_cues: ['A leader equates criticism with betrayal', 'Members threaten exclusion over disagreement'],
    possible_initial_responses: [
      'May conceal dissent while assessing the cost.',
      'May challenge the demand and prepare to leave.',
    ],
    possible_decision_tendencies: [
      'May oppose loyalty tests and unchecked expulsion powers.',
      'May maintain several independent social ties.',
    ],
    moderating_factors: [
      'Dependence on the group for practical support',
      'Availability of a welcoming alternative community',
    ],
    alternative_outcome: 'They may build strong commitments to a group that protects disagreement.',
    source_ids: ['S03', 'S11', 'S14'],
  },
  {
    id: 'FE_N042',
    valence: 'negative',
    title: 'Betrayed by an admired authority',
    domain: 'beliefs_and_authority',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'single_event',
    experience:
      'An admired leader was discovered exploiting others while publicly claiming to uphold the values the person trusted.',
    possible_meanings: ['Moral language can conceal self-interest.', 'Status should not exempt anyone from scrutiny.'],
    reminder_cues: ['A leader asks for an ethical exception', 'Public virtue claims without accountability'],
    possible_initial_responses: [
      'May feel anger or disillusionment.',
      'May closely inspect the gap between words and conduct.',
    ],
    possible_decision_tendencies: [
      'May demand independent oversight of respected figures.',
      'May judge proposals by conduct and evidence rather than reputation alone.',
    ],
    moderating_factors: [
      "How central the leader was to the person's identity",
      'Presence of other credible role models',
    ],
    alternative_outcome:
      'The person may retain their underlying values while revising trust in the leader or institution.',
    source_ids: ['S10'],
  },
  {
    id: 'FE_N043',
    valence: 'negative',
    title: 'Pressured into an action that violated conscience',
    domain: 'moral_conflict',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'single_event',
    experience:
      'Under strong group or authority pressure, the person participated in an action they believed seriously harmed someone.',
    possible_meanings: [
      'Following orders does not remove my responsibility.',
      'I failed to live up to an important value.',
    ],
    reminder_cues: ['An instruction that resembles the earlier choice', 'Someone says everyone does it'],
    possible_initial_responses: [
      'May feel guilt and hesitate.',
      'May become unusually firm about refusing participation.',
    ],
    possible_decision_tendencies: [
      'May require an ethical objection process.',
      'May oppose a beneficial proposal if it repeats the earlier harm.',
    ],
    moderating_factors: [
      'Degree of coercion and actual responsibility',
      'Opportunities for repair and supportive reflection',
    ],
    alternative_outcome:
      'They may integrate responsibility without permanent self-condemnation and choose more deliberately in future.',
    source_ids: ['S10'],
  },
  {
    id: 'FE_N044',
    valence: 'negative',
    title: 'Could not prevent a serious harmful outcome',
    domain: 'moral_conflict',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'single_event',
    experience:
      'The person tried to help during a serious emergency but could not prevent harm and continued questioning what else they could have done.',
    possible_meanings: ['I should have been able to do more.', 'I need to be better prepared next time.'],
    reminder_cues: ['Another situation with limited resources', 'Praise that overlooks the loss they remember'],
    possible_initial_responses: [
      'May replay decisions or take excessive responsibility.',
      'May focus intensely on preparation.',
    ],
    possible_decision_tendencies: [
      'May resist decisions that leave vulnerable people without backup.',
      'May hesitate to lead when the outcome cannot be guaranteed.',
    ],
    moderating_factors: [
      'Their actual ability to influence the outcome',
      'Accurate debriefing and support from others involved',
    ],
    alternative_outcome: 'They may recognize genuine limits while retaining a constructive commitment to helping.',
    source_ids: ['S04', 'S10'],
  },
  {
    id: 'FE_N045',
    valence: 'negative',
    title: 'Repeated losses with little time to recover',
    domain: 'loss_and_separation',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'extended_period',
    experience:
      'Several significant losses occurred close together while work or caregiving demands left little space for adjustment.',
    possible_meanings: ['Another loss may be just around the corner.', 'I cannot afford to stop functioning.'],
    reminder_cues: ['A new demand during an anniversary period', 'Another unexpected change to a familiar routine'],
    possible_initial_responses: [
      'May feel emotionally flat or easily overwhelmed.',
      'May focus on immediate tasks and postpone reflection.',
    ],
    possible_decision_tendencies: [
      'May resist additional commitments despite normally being generous.',
      'May choose a simpler plan with less uncertainty.',
    ],
    moderating_factors: ['Current workload and time since the losses', 'Availability of rest and practical support'],
    alternative_outcome: 'With fewer demands, the person may regain emotional range and willingness to plan ahead.',
    source_ids: ['S04'],
  },
  {
    id: 'FE_N046',
    valence: 'negative',
    title: 'Caregiving demands consumed their own life',
    domain: 'caregiving_and_responsibility',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'extended_period',
    experience:
      'The person provided intensive care without enough practical support and repeatedly sacrificed sleep, work, or social contact.',
    possible_meanings: ["Other people's needs leave no room for mine.", 'If I step back, someone may suffer.'],
    reminder_cues: ['An open-ended request for help', 'Others describe sacrifice as an unlimited duty'],
    possible_initial_responses: [
      'May agree and then feel resentment or exhaustion.',
      'May refuse abruptly after reaching a limit.',
    ],
    possible_decision_tendencies: [
      'May insist on shared responsibilities and realistic schedules.',
      'May avoid commitments with no clear endpoint.',
    ],
    moderating_factors: [
      'Whether care was chosen and supported',
      "Access to respite and the dependent person's actual needs",
    ],
    alternative_outcome: 'Supported caregiving can retain meaning while becoming compatible with personal boundaries.',
    source_ids: ['S01', 'S11'],
  },
  {
    id: 'FE_N047',
    valence: 'negative',
    title: 'Migration followed by prolonged social isolation',
    domain: 'community_and_displacement',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'extended_period',
    experience:
      'After moving to a new place, language barriers and lack of contacts left the person isolated for a substantial period.',
    possible_meanings: [
      'I may struggle to find a place where I belong.',
      'Unfamiliar systems are easier with someone to guide me.',
    ],
    reminder_cues: ['Entering a group where everyone already knows each other', 'Instructions assume local knowledge'],
    possible_initial_responses: [
      'May hesitate to ask basic questions.',
      'May seek a familiar language or a welcoming contact.',
    ],
    possible_decision_tendencies: [
      'May favor accessible onboarding and language support.',
      'May prioritize stable social connections over another move.',
    ],
    moderating_factors: [
      'Whether the move was voluntary',
      'Experiences of welcome and practical access to participation',
    ],
    alternative_outcome:
      'A supportive network may make the new place feel like home without requiring abandonment of earlier ties.',
    source_ids: ['S02', 'S11'],
  },
  {
    id: 'FE_N048',
    valence: 'negative',
    title: 'Repeated misunderstanding without needed accommodations',
    domain: 'identity_and_inclusion',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'repeated',
    experience:
      "A setting repeatedly interpreted the person's communication or access needs as rudeness or lack of effort and refused reasonable adjustments.",
    possible_meanings: ['Others may misread my intentions.', 'Participation costs me more than people realize.'],
    reminder_cues: ['An inflexible participation rule', 'Criticism of a communication style without clarification'],
    possible_initial_responses: [
      'May carefully script responses.',
      'May disengage when explaining needs feels futile.',
    ],
    possible_decision_tendencies: [
      'May support multiple ways to participate.',
      'May avoid leadership where accommodations depend on goodwill alone.',
    ],
    moderating_factors: [
      "Fit between the setting and the person's needs",
      'Availability of respectful clarification and adjustments',
    ],
    alternative_outcome:
      "An accessible environment may allow confident participation without changing the person's identity or abilities.",
    source_ids: ['S07', 'S09'],
  },
  {
    id: 'FE_N049',
    valence: 'negative',
    title: 'Public online harassment after speaking up',
    domain: 'peer_and_school',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'repeated',
    experience:
      'After posting an opinion, the person received repeated abusive messages and feared the harassment would spread into offline life.',
    possible_meanings: [
      'Visibility can attract people I cannot control.',
      'I need boundaries around public expression.',
    ],
    reminder_cues: [
      'A sudden surge of notifications',
      'Being asked to attach their identity to a contentious statement',
    ],
    possible_initial_responses: [
      'May stop reading replies or remove personal information.',
      'May seek moderation and document threatening messages.',
    ],
    possible_decision_tendencies: [
      'May prefer private deliberation on contentious issues.',
      'May prioritize moderation, privacy, and protection from harassment.',
    ],
    moderating_factors: ['Whether threats remain active', 'Quality of moderation and support from trusted people'],
    alternative_outcome: 'They may return to public participation with deliberate boundaries and suitable safeguards.',
    source_ids: ['S02', 'S04'],
  },
  {
    id: 'FE_N050',
    valence: 'negative',
    title: 'A project failed and blame fell on one person',
    domain: 'work_and_achievement',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'single_event',
    experience:
      'A collective project failed, but the group publicly blamed the person while ignoring shared decisions and constraints.',
    possible_meanings: [
      'Responsibility may be assigned unfairly after a setback.',
      'I need agreement about who owns each decision.',
    ],
    reminder_cues: ['A vague leadership role', 'A group starts searching for one person to blame'],
    possible_initial_responses: [
      'May defend their record or produce documentation.',
      'May avoid becoming the visible representative.',
    ],
    possible_decision_tendencies: [
      'May require clear roles and shared review of failures.',
      'May decline responsibility without matching authority.',
    ],
    moderating_factors: [
      'Accuracy of the original blame',
      'Whether current colleagues acknowledge shared responsibility',
    ],
    alternative_outcome: 'A fair team may restore willingness to lead and learn openly from failure.',
    source_ids: ['S09', 'S11', 'S16'],
  },
  {
    id: 'FE_P001',
    valence: 'positive',
    title: 'A caregiver reliably offered comfort',
    domain: 'family_and_caregiving',
    life_stages: ['early_childhood', 'childhood'],
    exposure_pattern: 'repeated',
    experience:
      'When frightened or upset, the child usually found a caregiver who stayed present and responded warmly.',
    possible_meanings: ['Distress can be shared with someone safe.', 'Needing comfort does not make me a burden.'],
    reminder_cues: ['A trusted person offers support', 'Someone becomes upset during a discussion'],
    possible_initial_responses: ['May ask for help directly.', "May remain present with another person's distress."],
    possible_decision_tendencies: [
      'May consult trusted people before a difficult choice.',
      'May allow time for emotional concerns in group decisions.',
    ],
    moderating_factors: [
      'Reliability of support in the present relationship',
      'Whether later experiences reinforced or contradicted this expectation',
    ],
    alternative_outcome:
      'They may still find particular situations frightening while retaining an expectation that support is possible.',
    source_ids: ['S05', 'S06', 'S08'],
  },
  {
    id: 'FE_P002',
    valence: 'positive',
    title: 'Daily life had dependable routines',
    domain: 'family_and_caregiving',
    life_stages: ['early_childhood', 'childhood', 'adolescence'],
    exposure_pattern: 'extended_period',
    experience:
      'Predictable meals, care arrangements, and ordinary family routines gave the child a dependable rhythm.',
    possible_meanings: [
      'Most everyday needs can be anticipated.',
      'Plans are useful because people usually follow through.',
    ],
    reminder_cues: ['A clear schedule', 'A plan for handling an upcoming change'],
    possible_initial_responses: [
      'May settle more easily when expectations are clear.',
      'May help organize the next practical step.',
    ],
    possible_decision_tendencies: [
      'May favor realistic schedules and consistent procedures.',
      'May plan ahead instead of assuming immediate scarcity.',
    ],
    moderating_factors: ['Flexibility permitted within the routines', 'Stability of present resources'],
    alternative_outcome: 'They may value predictability while learning to tolerate necessary changes.',
    source_ids: ['S06', 'S01'],
  },
  {
    id: 'FE_P003',
    valence: 'positive',
    title: 'A caregiver apologized and repaired harm',
    domain: 'family_and_caregiving',
    life_stages: ['childhood', 'adolescence'],
    exposure_pattern: 'repeated',
    experience:
      'After losing patience or making an unfair decision, a caregiver acknowledged the mistake and changed their behavior.',
    possible_meanings: [
      'Authority can admit error without losing all legitimacy.',
      'Repair requires action as well as an apology.',
    ],
    reminder_cues: ['Someone acknowledges a mistake', 'An opportunity to correct an unfair decision'],
    possible_initial_responses: [
      'May remain engaged rather than assume the relationship is over.',
      'May ask what will change next.',
    ],
    possible_decision_tendencies: [
      'May support a leader who accepts accountability and makes repairs.',
      'May revise their own decision publicly when evidence warrants it.',
    ],
    moderating_factors: ['Whether apologies were followed by change', 'Seriousness and repetition of the present harm'],
    alternative_outcome:
      'They may distinguish sincere repair from repeated apologies that protect an unchanged pattern.',
    source_ids: ['S01', 'S08'],
  },
  {
    id: 'FE_P004',
    valence: 'positive',
    title: 'Family disagreements ended without intimidation',
    domain: 'family_and_caregiving',
    life_stages: ['childhood', 'adolescence'],
    exposure_pattern: 'repeated',
    experience:
      'The child regularly saw adults disagree, listen, and negotiate without threats or withdrawal of affection.',
    possible_meanings: ['Conflict does not have to end a relationship.', 'Different preferences can be discussed.'],
    reminder_cues: ['A respectful difference of opinion', 'Two people propose incompatible plans'],
    possible_initial_responses: [
      'May ask questions rather than assume hostility.',
      'May explain their own position calmly.',
    ],
    possible_decision_tendencies: [
      "May vote against a friend's proposal without treating it as betrayal.",
      'May seek workable compromises while keeping clear boundaries.',
    ],
    moderating_factors: ['Actual safety of the current disagreement', 'Whether the other side is willing to negotiate'],
    alternative_outcome:
      'They may still disengage from genuinely coercive conflict rather than expect discussion to solve every situation.',
    source_ids: ['S01', 'S05'],
  },
  {
    id: 'FE_P005',
    valence: 'positive',
    title: 'Feelings were heard without dictating the rules',
    domain: 'family_and_caregiving',
    life_stages: ['early_childhood', 'childhood'],
    exposure_pattern: 'repeated',
    experience: 'A caregiver acknowledged disappointment or anger while calmly maintaining reasonable limits.',
    possible_meanings: [
      'A feeling can be valid even when I cannot have what I want.',
      'Limits need not mean rejection.',
    ],
    reminder_cues: ['A respectful refusal', 'A discussion where emotions and practical constraints both matter'],
    possible_initial_responses: [
      'May describe disappointment without immediately escalating.',
      'May listen to a boundary while asking about alternatives.',
    ],
    possible_decision_tendencies: [
      'May accept an unfavorable vote if the process is fair.',
      'May separate hearing a complaint from automatically granting every request.',
    ],
    moderating_factors: ['Fairness and consistency of the limits', 'Stress level and stakes in the present situation'],
    alternative_outcome: 'They can remain upset about an outcome while continuing to participate constructively.',
    source_ids: ['S05', 'S08'],
  },
  {
    id: 'FE_P006',
    valence: 'positive',
    title: 'Personal boundaries were respected',
    domain: 'family_and_caregiving',
    life_stages: ['childhood', 'adolescence'],
    exposure_pattern: 'repeated',
    experience:
      'Trusted adults respected reasonable preferences about touch, privacy, and personal space and explained necessary exceptions.',
    possible_meanings: ['I can express a boundary.', "Other people's boundaries deserve the same consideration."],
    reminder_cues: ['Someone asks before sharing or touching', 'An invitation they do not want to accept'],
    possible_initial_responses: ['May state a preference clearly.', 'May check whether another person is comfortable.'],
    possible_decision_tendencies: [
      'May favor explicit consent and easy ways to decline.',
      'May refuse participation without assuming the relationship must end.',
    ],
    moderating_factors: ['Power differences in the current setting', 'Whether refusal is actually respected'],
    alternative_outcome:
      'Confidence with familiar people may not automatically transfer to every authority or setting.',
    source_ids: ['S05', 'S08'],
  },
  {
    id: 'FE_P007',
    valence: 'positive',
    title: 'Age-appropriate choices were taken seriously',
    domain: 'agency_and_mastery',
    life_stages: ['childhood', 'adolescence'],
    exposure_pattern: 'repeated',
    experience:
      'Adults offered meaningful choices about activities and responsibilities, then helped the child understand their consequences.',
    possible_meanings: [
      'My preferences can influence what happens.',
      'Choosing includes responsibility for consequences.',
    ],
    reminder_cues: ['A genuine invitation to choose', 'An opportunity to propose an alternative'],
    possible_initial_responses: [
      'May identify what they want before seeking approval.',
      'May ask about the consequences of each option.',
    ],
    possible_decision_tendencies: [
      'May participate actively in a vote.',
      'May favor arrangements that give affected people a meaningful voice.',
    ],
    moderating_factors: [
      'Whether choices were real rather than symbolic',
      'Their understanding of the current options',
    ],
    alternative_outcome:
      'They may choose to delegate when someone else has relevant expertise while retaining their own judgment.',
    source_ids: ['S08', 'S09'],
  },
  {
    id: 'FE_P008',
    valence: 'positive',
    title: 'Mistakes brought guidance rather than humiliation',
    domain: 'agency_and_mastery',
    life_stages: ['childhood', 'adolescence'],
    exposure_pattern: 'repeated',
    experience:
      'When the child broke something or misunderstood a task, an adult helped them repair it and learn without attacking their worth.',
    possible_meanings: ['An error is something I can address.', 'Admitting a mistake can lead to useful help.'],
    reminder_cues: ['A task goes wrong', 'A leader invites early disclosure of problems'],
    possible_initial_responses: [
      'May acknowledge the error sooner.',
      'May look for a repair instead of hiding evidence.',
    ],
    possible_decision_tendencies: [
      'May support small trials with review and correction.',
      'May favor accountability that includes learning and repair.',
    ],
    moderating_factors: ['Whether consequences remained proportionate', 'Current incentives for reporting errors'],
    alternative_outcome: 'They may remain appropriately cautious when mistakes have serious irreversible consequences.',
    source_ids: ['S08', 'S09', 'S16'],
  },
  {
    id: 'FE_P009',
    valence: 'positive',
    title: 'Warmth continued through ordinary failure',
    domain: 'family_and_caregiving',
    life_stages: ['childhood', 'adolescence'],
    exposure_pattern: 'repeated',
    experience:
      'After losing a competition or receiving a disappointing grade, the child remained included and valued at home.',
    possible_meanings: ['Performance is only one part of my worth.', 'A setback does not cost me my relationships.'],
    reminder_cues: ['A disappointing result', 'Someone admits they did not succeed'],
    possible_initial_responses: [
      'May feel disappointed without immediately hiding.',
      'May offer comfort without demanding a quick comeback.',
    ],
    possible_decision_tendencies: [
      'May try a worthwhile challenge despite uncertainty.',
      "May assess performance separately from a person's entitlement to respect.",
    ],
    moderating_factors: ['Other sources of achievement pressure', 'How the current group responds to failure'],
    alternative_outcome:
      'They may still care strongly about excellence while avoiding the belief that every failure threatens belonging.',
    source_ids: ['S05', 'S08', 'S13'],
  },
  {
    id: 'FE_P010',
    valence: 'positive',
    title: 'A safe adult remained present through disruption',
    domain: 'family_and_caregiving',
    life_stages: ['early_childhood', 'childhood', 'adolescence'],
    exposure_pattern: 'extended_period',
    experience:
      'During family upheaval, one caregiver or trusted adult consistently kept contact and provided dependable care.',
    possible_meanings: [
      'Some relationships remain reliable even during change.',
      'I do not have to face every disruption alone.',
    ],
    reminder_cues: ['A trusted person keeps a small promise', 'A major transition becomes unavoidable'],
    possible_initial_responses: [
      'May reach out to established support.',
      'May focus on the parts of life that remain stable.',
    ],
    possible_decision_tendencies: [
      'May preserve reliable relationships during organizational change.',
      'May support continuity plans for people affected by a transition.',
    ],
    moderating_factors: ['Duration and quality of the relationship', 'Whether present support is genuinely available'],
    alternative_outcome:
      'The person may retain grief or fear about the disruption while also carrying a strong expectation of help.',
    source_ids: ['S08', 'S06'],
  },
  {
    id: 'FE_P011',
    valence: 'positive',
    title: 'An enduring reciprocal friendship',
    domain: 'trust_and_belonging',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'extended_period',
    experience: 'A friend consistently shared interests, respected differences, and offered care that went both ways.',
    possible_meanings: ['I can be known without performing all the time.', 'Support works best when it is reciprocal.'],
    reminder_cues: [
      'A friend checks in without asking for a favor',
      'A small disagreement within a valued relationship',
    ],
    possible_initial_responses: [
      'May express needs more openly.',
      'May give the relationship room to recover from ordinary friction.',
    ],
    possible_decision_tendencies: [
      'May consider how a choice affects mutual commitments.',
      'May invest in long-term cooperation rather than only immediate gain.',
    ],
    moderating_factors: ['Health of the current friendship', 'Boundaries and reciprocity in the requested commitment'],
    alternative_outcome: 'They may value friendship deeply while declining unfair demands made in its name.',
    source_ids: ['S05', 'S06', 'S11'],
  },
  {
    id: 'FE_P012',
    valence: 'positive',
    title: 'Someone intervened when they were mistreated',
    domain: 'trust_and_belonging',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'single_event',
    experience: 'A peer or adult noticed mistreatment, acted safely to stop it, and stayed to offer support.',
    possible_meanings: [
      'Other people may act when something is wrong.',
      'I deserve protection even when I lack power.',
    ],
    reminder_cues: ['A bystander notices someone being singled out', 'An ally offers specific practical help'],
    possible_initial_responses: [
      'May accept support with less hesitation.',
      'May look for a safe way to support someone else.',
    ],
    possible_decision_tendencies: [
      'May favor clear bystander and reporting procedures.',
      'May join a collective response instead of assuming they must act alone.',
    ],
    moderating_factors: [
      'Whether intervention actually improved safety',
      'Risks and support available in the current situation',
    ],
    alternative_outcome:
      'The person may choose quiet or indirect support when public intervention would increase danger.',
    source_ids: ['S02', 'S08'],
  },
  {
    id: 'FE_P013',
    valence: 'positive',
    title: 'Welcomed into a new school or community',
    domain: 'community_and_displacement',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'extended_period',
    experience:
      'After arriving somewhere unfamiliar, people introduced the person to others, explained routines, and included them in activities.',
    possible_meanings: [
      'Being new does not have to mean being unwanted.',
      'Small acts of welcome can make participation possible.',
    ],
    reminder_cues: ['A newcomer stands apart from the group', 'A setting uses unfamiliar customs or language'],
    possible_initial_responses: ['May ask questions and approach others.', 'May notice who needs an introduction.'],
    possible_decision_tendencies: [
      'May support clear onboarding and accessible participation.',
      'May choose to include a newcomer in a shared decision.',
    ],
    moderating_factors: [
      'Whether welcome continued after the first day',
      'Remaining language, financial, or access barriers',
    ],
    alternative_outcome:
      'They may feel comfortable entering new groups while still preferring familiar company at times.',
    source_ids: ['S05', 'S07', 'S11', 'S14'],
  },
  {
    id: 'FE_P014',
    valence: 'positive',
    title: 'A teacher noticed and encouraged a strength',
    domain: 'peer_and_school',
    life_stages: ['childhood', 'adolescence'],
    exposure_pattern: 'repeated',
    experience: 'A teacher identified a specific ability, gave useful feedback, and provided chances to develop it.',
    possible_meanings: [
      'My abilities can be noticed and developed.',
      'Feedback can help me improve rather than merely rank me.',
    ],
    reminder_cues: ['Specific encouragement from a credible person', 'An opportunity to practice a familiar strength'],
    possible_initial_responses: [
      'May approach the task with curiosity.',
      'May seek feedback instead of guessing alone.',
    ],
    possible_decision_tendencies: [
      'May invest time in developing skills.',
      'May support opportunities that reveal overlooked talent.',
    ],
    moderating_factors: ['Credibility and specificity of the encouragement', 'Access to actual practice and resources'],
    alternative_outcome:
      'Confidence may stay specific to that skill rather than becoming a belief that they can do everything well.',
    source_ids: ['S06', 'S09'],
  },
  {
    id: 'FE_P015',
    valence: 'positive',
    title: 'A mentor helped without taking over',
    domain: 'agency_and_mastery',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'extended_period',
    experience: 'A mentor offered guidance and access while leaving the person ownership of meaningful decisions.',
    possible_meanings: [
      'Support and independence can coexist.',
      'I can learn from expertise without surrendering judgment.',
    ],
    reminder_cues: ['An experienced person offers options', 'A difficult task with room to ask for guidance'],
    possible_initial_responses: ['May seek advice early.', 'May compare recommendations with their own goals.'],
    possible_decision_tendencies: [
      'May support mentorship with clear boundaries.',
      'May delegate thoughtfully instead of equating help with weakness.',
    ],
    moderating_factors: ["Mentor's respect for autonomy", 'Fit between the advice and the current problem'],
    alternative_outcome: "They may question a mentor's advice respectfully when their circumstances differ.",
    source_ids: ['S08', 'S09'],
  },
  {
    id: 'FE_P016',
    valence: 'positive',
    title: 'Belonged to a cooperative team',
    domain: 'peer_and_school',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'extended_period',
    experience:
      'In a team activity, roles were complementary and members practiced, contributed, and celebrated shared results.',
    possible_meanings: [
      'Different strengths can produce a better result together.',
      'My contribution matters even when it is not the most visible.',
    ],
    reminder_cues: ['A problem requires several kinds of skill', 'A teammate offers to share responsibility'],
    possible_initial_responses: [
      'May ask who is best placed to do each task.',
      'May coordinate rather than compete for every role.',
    ],
    possible_decision_tendencies: [
      'May favor balanced teams over a single dominant performer.',
      'May accept a supporting role when it serves the shared goal.',
    ],
    moderating_factors: ['Fairness of credit and workload', 'Whether current team members are dependable'],
    alternative_outcome: 'They may still prefer independent work for tasks where coordination offers little benefit.',
    source_ids: ['S05', 'S07'],
  },
  {
    id: 'FE_P017',
    valence: 'positive',
    title: 'Helped decide a real school or group matter',
    domain: 'agency_and_mastery',
    life_stages: ['childhood', 'adolescence'],
    exposure_pattern: 'single_event',
    experience:
      "Adults invited the young person's input on a real decision and explained how the final choice used that input.",
    possible_meanings: [
      'My voice can have practical consequences.',
      'Participation is worthwhile when it is taken seriously.',
    ],
    reminder_cues: ['A consultation with a clear decision process', 'An invitation to represent peers'],
    possible_initial_responses: [
      'May prepare a view and ask how input will be used.',
      "May listen to other participants' priorities.",
    ],
    possible_decision_tendencies: [
      'May take voting and consultation seriously.',
      'May oppose token participation with no influence on the outcome.',
    ],
    moderating_factors: ['Actual scope of the earlier influence', 'Transparency of the current process'],
    alternative_outcome: 'They may accept that being heard does not guarantee getting their preferred outcome.',
    source_ids: ['S08', 'S09'],
  },
  {
    id: 'FE_P018',
    valence: 'positive',
    title: 'A difficult skill improved through practice',
    domain: 'agency_and_mastery',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'extended_period',
    experience:
      'After repeated practice and useful feedback, the person became capable at something that initially felt beyond them.',
    possible_meanings: [
      'Some abilities improve with the right practice.',
      'Early difficulty does not settle the final outcome.',
    ],
    reminder_cues: ['A challenging but learnable task', 'Evidence of incremental progress'],
    possible_initial_responses: ['May try a manageable first step.', 'May seek feedback and adjust their approach.'],
    possible_decision_tendencies: [
      'May support training before judging someone incapable.',
      'May choose a demanding goal when time and resources make improvement plausible.',
    ],
    moderating_factors: [
      'Similarity between past and current skills',
      'Access to effective practice rather than effort alone',
    ],
    alternative_outcome:
      'They may recognize real constraints and change strategy when repeated practice is not working.',
    source_ids: ['S09'],
  },
  {
    id: 'FE_P019',
    valence: 'positive',
    title: 'Recovered from a setback with practical support',
    domain: 'agency_and_mastery',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'extended_period',
    experience:
      'After a failed exam or project, the person received specific help, changed their approach, and succeeded on a later attempt.',
    possible_meanings: [
      'A setback can contain useful information.',
      'Recovery may require a different strategy and help.',
    ],
    reminder_cues: ['A disappointing first attempt', 'Someone offers concrete feedback rather than blame'],
    possible_initial_responses: ['May review what can be changed.', 'May ask for targeted assistance.'],
    possible_decision_tendencies: [
      'May give a promising proposal a revised second attempt.',
      'May support review points instead of demanding guaranteed success immediately.',
    ],
    moderating_factors: [
      'Whether the new attempt addresses the original problem',
      'Costs and reversibility of trying again',
    ],
    alternative_outcome:
      'They may stop a failing approach when new evidence shows that further attempts are not worthwhile.',
    source_ids: ['S09', 'S08'],
  },
  {
    id: 'FE_P020',
    valence: 'positive',
    title: 'Creative expression was taken seriously',
    domain: 'agency_and_mastery',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'repeated',
    experience:
      "Other people listened to the person's stories, art, music, or ideas with interest and offered room to experiment.",
    possible_meanings: [
      'My perspective can contribute something worthwhile.',
      'Exploration does not require immediate perfection.',
    ],
    reminder_cues: ['An open-ended problem', 'An invitation to suggest an unconventional idea'],
    possible_initial_responses: [
      'May generate several possibilities.',
      'May share unfinished work for constructive discussion.',
    ],
    possible_decision_tendencies: [
      'May support limited experiments and creative participation.',
      'May value expressive activities alongside practical needs.',
    ],
    moderating_factors: [
      'Whether feedback respected ownership',
      'Resources and tolerance for uncertainty in the present setting',
    ],
    alternative_outcome: 'They may enjoy creative freedom while accepting constraints needed for a particular task.',
    source_ids: ['S07', 'S09'],
  },
  {
    id: 'FE_P021',
    valence: 'positive',
    title: 'Questions received patient explanations',
    domain: 'beliefs_and_authority',
    life_stages: ['childhood', 'adolescence'],
    exposure_pattern: 'repeated',
    experience:
      'A trusted adult welcomed sincere questions, explained their reasoning, and sometimes admitted not knowing.',
    possible_meanings: ['Questions can improve understanding.', 'A trustworthy person can acknowledge uncertainty.'],
    reminder_cues: ['A confident claim without an explanation', 'An unfamiliar idea presented respectfully'],
    possible_initial_responses: [
      'May ask how the claim is supported.',
      'May remain curious when there is no immediate answer.',
    ],
    possible_decision_tendencies: [
      'May request reasons before voting.',
      'May revise a position when the explanation or evidence changes.',
    ],
    moderating_factors: [
      'Whether questioning is safe in the present setting',
      'Knowledge and time available to assess the evidence',
    ],
    alternative_outcome:
      'They may rely on a trusted expert when personal investigation is impractical while remaining open to correction.',
    source_ids: ['S08', 'S09', 'S16'],
  },
  {
    id: 'FE_P022',
    valence: 'positive',
    title: 'Observed a trusted person revise a mistaken belief',
    domain: 'beliefs_and_authority',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'single_event',
    experience:
      'Someone the person respected openly changed their mind after checking evidence and explained the revision without shame.',
    possible_meanings: ['Changing my mind can be responsible.', 'Confidence and accuracy are different things.'],
    reminder_cues: ['Credible evidence contradicts a prior view', 'A respected person says they were mistaken'],
    possible_initial_responses: [
      'May pause before defending the earlier position.',
      'May compare the new evidence with their assumptions.',
    ],
    possible_decision_tendencies: [
      'May support revisiting a decision when facts change.',
      'May avoid treating consistency alone as proof of integrity.',
    ],
    moderating_factors: ['Quality of the new evidence', 'Social costs of revising a public commitment'],
    alternative_outcome:
      'The person may remain committed when counterarguments are weak rather than changing views simply to appear flexible.',
    source_ids: ['S09', 'S16'],
  },
  {
    id: 'FE_P023',
    valence: 'positive',
    title: 'Successful cooperation across a social divide',
    domain: 'identity_and_inclusion',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'extended_period',
    experience:
      'The person worked on a shared task with people from a group they knew mostly through stereotypes and developed reciprocal respect.',
    possible_meanings: [
      'A group label tells me little about an individual partner.',
      'Shared goals can make cooperation possible.',
    ],
    reminder_cues: ['A proposed partnership with unfamiliar people', 'Someone generalizes from identity to character'],
    possible_initial_responses: [
      'May seek direct information about the individuals.',
      'May recall specific examples that complicate the stereotype.',
    ],
    possible_decision_tendencies: [
      'May judge partners by conduct and competence.',
      'May support cooperation with safeguards that apply equally to everyone.',
    ],
    moderating_factors: [
      'Equality and reciprocity in the earlier cooperation',
      'Actual conduct of the current partners',
    ],
    alternative_outcome:
      'Trust may initially extend to particular individuals and need not generalize immediately to every context.',
    source_ids: ['S07', 'S11'],
  },
  {
    id: 'FE_P024',
    valence: 'positive',
    title: 'Cultural belonging offered joy and continuity',
    domain: 'identity_and_inclusion',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'repeated',
    experience:
      'Shared language, celebrations, stories, or traditions gave the person a welcoming sense of continuity and belonging.',
    possible_meanings: [
      'I am connected to something larger than myself.',
      'Shared practices can carry care and memory.',
    ],
    reminder_cues: ['A familiar celebration or language', 'An opportunity to pass on a valued tradition'],
    possible_initial_responses: [
      'May feel connected and more willing to participate.',
      'May invite others to share a meaningful practice.',
    ],
    possible_decision_tendencies: [
      'May preserve valued community activities in a budget.',
      'May consider how change affects continuity and belonging.',
    ],
    moderating_factors: [
      'Whether participation is voluntary and inclusive',
      "How the tradition fits the person's current values",
    ],
    alternative_outcome: 'They may adapt or leave particular practices while retaining affection for their community.',
    source_ids: ['S05', 'S06'],
  },
  {
    id: 'FE_P025',
    valence: 'positive',
    title: 'A spiritual community responded with compassion',
    domain: 'beliefs_and_authority',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'extended_period',
    experience:
      'During difficulty, a religious or spiritual community offered practical care, companionship, and room for sincere questions.',
    possible_meanings: [
      'My beliefs can connect me with care and purpose.',
      'A community can help without demanding that I hide difficulty.',
    ],
    reminder_cues: ['A shared practice associated with support', 'Someone seeks help during a period of doubt'],
    possible_initial_responses: [
      'May seek companionship or a meaningful practice.',
      'May offer help grounded in their own values.',
    ],
    possible_decision_tendencies: [
      'May support voluntary community care.',
      'May consider spiritual commitments alongside practical consequences.',
    ],
    moderating_factors: [
      'Whether support respects freedom and difference',
      "The person's own interpretation of the experience",
    ],
    alternative_outcome:
      "Compassionate conduct may matter more to them than a group's label; the experience does not imply superiority over other beliefs.",
    source_ids: ['S06', 'S08'],
  },
  {
    id: 'FE_P026',
    valence: 'positive',
    title: 'An ethical community provided purpose without shared religion',
    domain: 'beliefs_and_authority',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'extended_period',
    experience:
      'The person found belonging in a community organized around service, inquiry, or shared ethical commitments without requiring a common religious belief.',
    possible_meanings: [
      'Shared responsibility can give life meaning.',
      'People can cooperate ethically despite different beliefs.',
    ],
    reminder_cues: [
      'An opportunity to act on a shared value',
      'People disagree about ultimate beliefs but want to help',
    ],
    possible_initial_responses: [
      'May focus on practical common ground.',
      'May seek a respectful way to include differing convictions.',
    ],
    possible_decision_tendencies: [
      'May judge a proposal by its effects and agreed principles.',
      'May support cooperation across religious and nonreligious differences.',
    ],
    moderating_factors: ['Whether the community tolerates real disagreement', "The person's own moral commitments"],
    alternative_outcome:
      'They may retain, change, or remain uncertain about religious beliefs while keeping the relationships and values they found.',
    source_ids: ['S11', 'S07'],
  },
  {
    id: 'FE_P027',
    valence: 'positive',
    title: 'A neighbor became a dependable source of help',
    domain: 'community_and_displacement',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'repeated',
    experience:
      'A neighbor repeatedly offered practical, respectful help and could also rely on the household in return.',
    possible_meanings: [
      'Support can exist beyond family and close friends.',
      'Local cooperation can make daily life more secure.',
    ],
    reminder_cues: ['A nearby person needs a small practical favor', 'A local problem affects several households'],
    possible_initial_responses: [
      'May approach neighbors instead of struggling alone.',
      'May offer a specific manageable contribution.',
    ],
    possible_decision_tendencies: [
      'May support local mutual aid and shared facilities.',
      'May consider informal community knowledge alongside official plans.',
    ],
    moderating_factors: [
      'Reciprocity and boundaries in the relationship',
      'Whether current neighbors are safe and dependable',
    ],
    alternative_outcome: 'They may participate warmly in local life while keeping personal privacy.',
    source_ids: ['S06', 'S07'],
  },
  {
    id: 'FE_P028',
    valence: 'positive',
    title: 'Received essential help without humiliation',
    domain: 'material_security',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'single_event',
    experience:
      'During a financial setback, a person or organization provided necessary help privately and without demanding gratitude or obedience.',
    possible_meanings: [
      'Needing help does not remove my dignity.',
      'Support can restore choice rather than create a debt of loyalty.',
    ],
    reminder_cues: ['A respectful offer of assistance', 'Someone worries about being judged for needing help'],
    possible_initial_responses: [
      'May ask what support is available.',
      'May offer help without publicly exposing the recipient.',
    ],
    possible_decision_tendencies: [
      'May support accessible and confidential assistance.',
      'May accept a temporary safety net instead of hiding the problem.',
    ],
    moderating_factors: ['Whether the help had undisclosed conditions', 'Adequacy and reliability of the assistance'],
    alternative_outcome: 'They may value assistance while preferring independence when it is practical.',
    source_ids: ['S01', 'S11'],
  },
  {
    id: 'FE_P029',
    valence: 'positive',
    title: 'A household regained stable access to necessities',
    domain: 'material_security',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'extended_period',
    experience:
      'After a period of uncertainty, dependable income or support made food, housing, and essential care consistently available.',
    possible_meanings: ['The future can become more predictable.', 'I can make plans beyond the next immediate need.'],
    reminder_cues: ['Reliable provision arrives on schedule', 'An opportunity requires a longer planning horizon'],
    possible_initial_responses: [
      'May gradually feel less urgency around resources.',
      'May explore goals previously postponed.',
    ],
    possible_decision_tendencies: [
      'May invest in education or maintenance when necessities are covered.',
      'May support preserving a dependable minimum level of provision.',
    ],
    moderating_factors: ['How durable the stability appears', 'Remaining debts, obligations, and memories of scarcity'],
    alternative_outcome: 'Caution about resources may persist alongside greater willingness to plan and participate.',
    source_ids: ['S01', 'S12'],
  },
  {
    id: 'FE_P030',
    valence: 'positive',
    title: 'Earned and managed a first independent income',
    domain: 'agency_and_mastery',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'extended_period',
    experience:
      'The person earned money through manageable work and learned to use it for their own needs and chosen goals.',
    possible_meanings: ['My actions can increase my options.', 'Small choices about resources accumulate over time.'],
    reminder_cues: ['A realistic chance to earn or save', 'A decision between immediate spending and a chosen goal'],
    possible_initial_responses: [
      'May compare costs and priorities.',
      'May feel capable of taking a practical next step.',
    ],
    possible_decision_tendencies: [
      'May value fair compensation and financial autonomy.',
      'May favor plans with a clear route from effort to benefit.',
    ],
    moderating_factors: [
      'Whether earnings were sufficient and freely controlled',
      'Current constraints and responsibilities',
    ],
    alternative_outcome:
      'They may recognize that effort alone does not overcome every structural barrier to financial security.',
    source_ids: ['S09', 'S12'],
  },
  {
    id: 'FE_P031',
    valence: 'positive',
    title: 'Shared finances were handled transparently',
    domain: 'trust_and_belonging',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'extended_period',
    experience:
      'In a household or group, contributions and expenses were explained openly and questions about money were welcomed.',
    possible_meanings: [
      'Pooling resources can work when records are clear.',
      'Questions about money need not imply disloyalty.',
    ],
    reminder_cues: ['A shared budget with accessible records', 'Someone requests clarification of an expense'],
    possible_initial_responses: [
      'May ask factual questions without assuming fraud.',
      'May share relevant information promptly.',
    ],
    possible_decision_tendencies: [
      'May support collective spending with transparent accounts.',
      'May prefer agreed rules to informal assurances.',
    ],
    moderating_factors: ['Quality of records and actual conduct', 'Whether questioning remains free from retaliation'],
    alternative_outcome:
      'They may become cautious when transparency disappears rather than extending trust unconditionally.',
    source_ids: ['S11'],
  },
  {
    id: 'FE_P032',
    valence: 'positive',
    title: 'A partner consistently respected autonomy',
    domain: 'trust_and_belonging',
    life_stages: ['adulthood'],
    exposure_pattern: 'extended_period',
    experience:
      'A close partner supported independent friendships, listened to refusals, and negotiated shared decisions without control.',
    possible_meanings: ['Closeness can leave room for independence.', 'I can disagree and remain loved.'],
    reminder_cues: ['A partner asks about their preference', 'A choice affects both personal and shared plans'],
    possible_initial_responses: ['May express needs directly.', 'May discuss tradeoffs without assuming coercion.'],
    possible_decision_tendencies: [
      'May favor shared decisions with individual consent.',
      'May resist demands that loyalty requires giving up all independence.',
    ],
    moderating_factors: ["Consistency of the current partner's behavior", 'Real differences in power and resources'],
    alternative_outcome:
      'The person may still need time to trust in a new relationship despite a positive earlier one.',
    source_ids: ['S11'],
  },
  {
    id: 'FE_P033',
    valence: 'positive',
    title: 'A relationship ended respectfully',
    domain: 'trust_and_belonging',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'single_event',
    experience:
      'A valued relationship ended with honest explanation, maintained boundaries, and no deliberate humiliation or retaliation.',
    possible_meanings: [
      'A relationship can end without proving either person worthless.',
      'An honest refusal can be kinder than prolonged pretense.',
    ],
    reminder_cues: ['A difficult conversation about incompatibility', 'Someone wants to leave an arrangement'],
    possible_initial_responses: [
      'May feel sadness while listening to the explanation.',
      'May state a boundary without trying to punish the other person.',
    ],
    possible_decision_tendencies: [
      'May support clear and fair exit procedures.',
      'May end an unsuitable commitment rather than maintain it solely to avoid discomfort.',
    ],
    moderating_factors: [
      'Whether both people honored boundaries afterward',
      'Attachment, practical dependence, and current safety',
    ],
    alternative_outcome: 'They may still grieve deeply; respectful treatment does not make separation painless.',
    source_ids: ['S11'],
  },
  {
    id: 'FE_P034',
    valence: 'positive',
    title: 'A conflict was repaired through mutual accountability',
    domain: 'trust_and_belonging',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'single_event',
    experience:
      'After a serious disagreement, both people listened, acknowledged their own actions, and followed through on agreed changes.',
    possible_meanings: [
      'Trust can sometimes be repaired through consistent action.',
      'Responsibility can be shared without making every action equivalent.',
    ],
    reminder_cues: [
      'A concrete proposal to repair a disagreement',
      'Someone accepts responsibility without demanding immediate forgiveness',
    ],
    possible_initial_responses: ['May cautiously re-engage.', 'May identify what evidence of change would matter.'],
    possible_decision_tendencies: [
      'May support a conditional second chance with review.',
      'May distinguish repairable mistakes from continued unsafe conduct.',
    ],
    moderating_factors: ['Severity of the harm and actual accountability', 'Freedom to decline reconciliation'],
    alternative_outcome:
      'They may decide that some relationships should remain ended even while believing repair is possible elsewhere.',
    source_ids: ['S11', 'S10'],
  },
  {
    id: 'FE_P035',
    valence: 'positive',
    title: 'Trusted people stayed present during grief',
    domain: 'loss_and_separation',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'extended_period',
    experience:
      'Following a loss, others listened, helped with daily tasks, and allowed mourning without forcing a timetable.',
    possible_meanings: ['Loss can be carried with other people.', 'I do not have to hide grief to remain included.'],
    reminder_cues: [
      "An anniversary or another person's bereavement",
      'An offer of practical help without pressure to feel better',
    ],
    possible_initial_responses: [
      'May ask for company or time alone openly.',
      'May offer patient companionship to someone grieving.',
    ],
    possible_decision_tendencies: [
      'May allow flexibility around bereavement and major life changes.',
      'May preserve important relationships during demanding periods.',
    ],
    moderating_factors: [
      "Fit of support with the person's preferences and culture",
      'Continuity of support after the immediate loss',
    ],
    alternative_outcome:
      'The person may remain sad or experience renewed grief while still functioning and accepting support.',
    source_ids: ['S04', 'S11'],
  },
  {
    id: 'FE_P036',
    valence: 'positive',
    title: 'Care was explained and consent was respected',
    domain: 'health_and_physical_safety',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'repeated',
    experience:
      'A clinician explained procedures, checked understanding, and offered meaningful choices whenever medically possible.',
    possible_meanings: ['Expertise can work with my agency.', 'Asking questions can improve care.'],
    reminder_cues: ['A professional explains options clearly', 'A decision requires understanding risks and benefits'],
    possible_initial_responses: [
      'May ask questions rather than silently endure uncertainty.',
      'May cooperate once they understand the plan.',
    ],
    possible_decision_tendencies: [
      'May seek expertise with transparent reasoning.',
      'May support informed consent in group services.',
    ],
    moderating_factors: ['Quality and honesty of the explanation', 'Urgency and available alternatives'],
    alternative_outcome: 'They may retain specific medical fears while being able to use trusted care effectively.',
    source_ids: ['S02', 'S09'],
  },
  {
    id: 'FE_P037',
    valence: 'positive',
    title: 'A limitation was met with useful accommodation',
    domain: 'identity_and_inclusion',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'extended_period',
    experience:
      'A school, workplace, or group adjusted the environment so the person could participate without having to conceal an access need.',
    possible_meanings: [
      'Participation can improve when the setting changes.',
      'Asking for an adjustment can be worthwhile.',
    ],
    reminder_cues: ['An invitation to discuss access needs', 'A capable person struggles with the default format'],
    possible_initial_responses: [
      'May describe the practical barrier directly.',
      'May suggest an alternative format or tool.',
    ],
    possible_decision_tendencies: [
      'May support multiple routes to participation.',
      'May assess ability after appropriate access is provided.',
    ],
    moderating_factors: ['Whether the adjustment actually addresses the need', 'Freedom from stigma or retaliation'],
    alternative_outcome:
      'They may advocate effectively while recognizing that different people need different adjustments.',
    source_ids: ['S07', 'S09'],
  },
  {
    id: 'FE_P038',
    valence: 'positive',
    title: 'Gradual recovery showed measurable progress',
    domain: 'health_and_physical_safety',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'extended_period',
    experience:
      'During recovery from an injury or illness, the person observed small improvements with appropriate care and a realistic plan.',
    possible_meanings: [
      'Progress may be gradual and uneven.',
      'Support and adjustment can make difficult goals possible.',
    ],
    reminder_cues: ['A long task with small milestones', 'A temporary setback within a larger improvement'],
    possible_initial_responses: [
      'May look for meaningful signs of progress.',
      'May adjust pace instead of treating a setback as total failure.',
    ],
    possible_decision_tendencies: [
      'May support realistic milestones and flexible participation.',
      'May value maintenance and recovery time alongside output.',
    ],
    moderating_factors: ['Medical realities and access to care', 'Whether the current challenge is comparable'],
    alternative_outcome:
      'They may acknowledge lasting limitations without interpreting them as a failure of effort or character.',
    source_ids: ['S09', 'S11'],
  },
  {
    id: 'FE_P039',
    valence: 'positive',
    title: 'A crisis response restored practical safety',
    domain: 'community_and_displacement',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'single_event',
    experience:
      'During an emergency, responders communicated clearly, met essential needs, and helped reconnect the person with trusted support.',
    possible_meanings: [
      'Coordinated help can make a dangerous situation more manageable.',
      'Clear information matters when people are frightened.',
    ],
    reminder_cues: ['An emergency plan with named responsibilities', 'A responder gives a calm, specific instruction'],
    possible_initial_responses: ['May seek reliable updates.', 'May cooperate with a credible response plan.'],
    possible_decision_tendencies: [
      'May support preparedness and communication systems.',
      'May judge emergency leadership by practical action and accountability.',
    ],
    moderating_factors: ['Actual reliability of current responders', 'Unresolved losses or fears from the emergency'],
    alternative_outcome: 'Appreciation of the response can coexist with distress about the emergency itself.',
    source_ids: ['S04', 'S08'],
  },
  {
    id: 'FE_P040',
    valence: 'positive',
    title: 'A complaint received a fair hearing',
    domain: 'institutional_trust',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'single_event',
    experience:
      "An independent reviewer listened to the person's complaint, checked relevant evidence, and explained a fair decision.",
    possible_meanings: [
      'Procedures can protect people with less power.',
      'Being heard can matter even when the outcome is not exactly what I requested.',
    ],
    reminder_cues: ['A clear appeal process', 'An official gives reasons that can be checked'],
    possible_initial_responses: [
      'May prepare evidence and use the process.',
      'May wait for review rather than assume retaliation.',
    ],
    possible_decision_tendencies: [
      'May support independent review and due process.',
      'May accept an unfavorable outcome more readily when the reasoning is credible.',
    ],
    moderating_factors: [
      'Independence and accessibility of the current process',
      'Whether earlier findings were actually enforced',
    ],
    alternative_outcome:
      'They may challenge an unfair procedure despite having had a good experience with another institution.',
    source_ids: ['S10', 'S11', 'S15'],
  },
  {
    id: 'FE_P041',
    valence: 'positive',
    title: 'Honesty was met with proportionate accountability',
    domain: 'moral_conflict',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'single_event',
    experience:
      'The person admitted causing a problem and received a fair consequence plus a clear opportunity to repair it.',
    possible_meanings: [
      'Honesty can make repair possible.',
      'Accountability does not have to mean permanent exclusion.',
    ],
    reminder_cues: ['A mistake they could conceal', 'A leader invites an accurate account of what happened'],
    possible_initial_responses: ['May disclose relevant facts sooner.', 'May ask what repair is needed.'],
    possible_decision_tendencies: [
      'May favor truthful reporting with proportionate consequences.',
      'May support a path back to participation after meaningful repair.',
    ],
    moderating_factors: ['Seriousness of the current harm', 'Whether the current response is genuinely fair'],
    alternative_outcome:
      'They may still fear consequences but choose honesty because the earlier experience made repair imaginable.',
    source_ids: ['S10', 'S08', 'S16'],
  },
  {
    id: 'FE_P042',
    valence: 'positive',
    title: 'A team handled failure without scapegoating',
    domain: 'work_and_achievement',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'single_event',
    experience:
      'After a project failed, the team examined shared decisions and system problems while holding each person responsible for their actual part.',
    possible_meanings: [
      'Failure can be examined accurately without sacrificing one person.',
      'Clear responsibility makes learning easier.',
    ],
    reminder_cues: ['A project review after an unexpected outcome', 'A request to describe a mistake or constraint'],
    possible_initial_responses: [
      'May contribute candid details.',
      'May focus on what can change rather than who can be blamed.',
    ],
    possible_decision_tendencies: [
      'May support documented roles and learning reviews.',
      'May accept leadership when responsibility and authority are aligned.',
    ],
    moderating_factors: [
      'Whether openness is protected in the current team',
      'Consequences and seriousness of the error',
    ],
    alternative_outcome:
      'They may still insist on consequences for deliberate wrongdoing rather than treating every failure as an innocent mistake.',
    source_ids: ['S09', 'S11', 'S16'],
  },
  {
    id: 'FE_P043',
    valence: 'positive',
    title: 'A colleague shared credit and opportunity fairly',
    domain: 'work_and_achievement',
    life_stages: ['adulthood'],
    exposure_pattern: 'repeated',
    experience:
      "A colleague consistently acknowledged the person's contribution and included them in opportunities arising from shared work.",
    possible_meanings: [
      'Collaboration can benefit everyone involved.',
      'Sharing an idea does not necessarily mean losing ownership.',
    ],
    reminder_cues: ['A partner attributes work accurately', 'An invitation to collaborate on a promising task'],
    possible_initial_responses: [
      'May share relevant ideas more openly.',
      "May acknowledge others' contributions in return.",
    ],
    possible_decision_tendencies: [
      'May invest in reciprocal partnerships.',
      'May favor clear credit and access to resulting opportunities.',
    ],
    moderating_factors: ['Track record of the current partner', 'Clarity of ownership and expectations'],
    alternative_outcome: 'They may cooperate generously while still documenting agreements for important projects.',
    source_ids: ['S11'],
  },
  {
    id: 'FE_P044',
    valence: 'positive',
    title: 'Coordinated action improved a shared condition',
    domain: 'community_and_displacement',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'extended_period',
    experience:
      'The person joined others in a practical effort that successfully improved a local service, facility, or group rule.',
    possible_meanings: [
      'Working with others can change a shared problem.',
      'Participation can matter even when my contribution is small.',
    ],
    reminder_cues: [
      'A concrete problem with an achievable collective remedy',
      'Others offer specific commitments to help',
    ],
    possible_initial_responses: ['May look for allies and a workable plan.', 'May volunteer for a defined task.'],
    possible_decision_tendencies: [
      'May participate in a vote linked to realistic follow-through.',
      'May support shared projects with clear responsibilities.',
    ],
    moderating_factors: [
      'Similarity of the new problem to the earlier success',
      'Actual power, resources, and participation available',
    ],
    alternative_outcome:
      'They may recognize when a proposal lacks a viable route to change and redirect effort rather than assume cooperation always succeeds.',
    source_ids: ['S07', 'S09'],
  },
  {
    id: 'FE_P045',
    valence: 'positive',
    title: 'Volunteering produced visible, respectful benefit',
    domain: 'caregiving_and_responsibility',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'repeated',
    experience:
      'Through a voluntary activity, the person saw that a manageable contribution met a need identified by the people receiving support.',
    possible_meanings: [
      "I can contribute without taking over someone else's life.",
      'Helpful action starts with understanding what is needed.',
    ],
    reminder_cues: [
      'A specific request from an affected person',
      'An opportunity to contribute within a clear boundary',
    ],
    possible_initial_responses: [
      'May ask what would actually help.',
      'May offer a realistic amount of time or effort.',
    ],
    possible_decision_tendencies: [
      "May favor practical assistance shaped by recipients' input.",
      'May balance generosity with sustainable commitments.',
    ],
    moderating_factors: ['Whether help was wanted and effective', 'Current capacity and risk of overcommitment'],
    alternative_outcome: 'They may decline ineffective or paternalistic projects while remaining committed to helping.',
    source_ids: ['S07', 'S11'],
  },
  {
    id: 'FE_P046',
    valence: 'positive',
    title: 'Learned to pause and express a difficult feeling',
    domain: 'emotion_and_coping',
    life_stages: ['childhood', 'adolescence', 'adulthood'],
    exposure_pattern: 'repeated',
    experience:
      'Through patient guidance and practice, the person learned to notice rising distress, pause, and describe what they needed.',
    possible_meanings: [
      'A strong feeling does not require immediate action.',
      'I can create some space before responding.',
    ],
    reminder_cues: ['A disagreement begins to feel overwhelming', 'An urge to agree or lash out immediately'],
    possible_initial_responses: ['May request a short break.', 'May name a feeling and ask for clarification.'],
    possible_decision_tendencies: [
      'May postpone a heated vote long enough to understand the options.',
      'May communicate a boundary before ending participation.',
    ],
    moderating_factors: ['Intensity of stress and actual safety', 'Practice, fatigue, and available time'],
    alternative_outcome: 'The skill may be harder to use under extreme stress and need not work every time.',
    source_ids: ['S08'],
  },
  {
    id: 'FE_P047',
    valence: 'positive',
    title: 'A previously feared conversation went safely',
    domain: 'emotion_and_coping',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'single_event',
    experience:
      'The person prepared for a difficult conversation, expressed a reasonable need, and received a respectful response.',
    possible_meanings: [
      'The outcome I fear is not inevitable.',
      'Preparation and respectful partners can make speaking up possible.',
    ],
    reminder_cues: ['A similar conversation with a safe person', 'An opportunity to rehearse a request'],
    possible_initial_responses: [
      'May feel nervous but try a clear opening statement.',
      'May recall the earlier successful conversation.',
    ],
    possible_decision_tendencies: [
      'May voice a preference instead of automatically conceding.',
      'May choose a private discussion before a public confrontation.',
    ],
    moderating_factors: ['Similarity and safety of the new situation', 'Whether the earlier success has been repeated'],
    alternative_outcome: 'Confidence may grow gradually and remain specific to certain people or circumstances.',
    source_ids: ['S09'],
  },
  {
    id: 'FE_P048',
    valence: 'positive',
    title: 'A sustained helping relationship supported change',
    domain: 'emotion_and_coping',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'extended_period',
    experience:
      'In a trusted counseling or other structured helping relationship, the person practiced useful coping skills and experienced respectful collaboration.',
    possible_meanings: ['Patterns I learned can change over time.', 'Seeking help can be an active choice.'],
    reminder_cues: [
      'An old reaction appears in a new situation',
      'A trusted helper invites reflection without judgment',
    ],
    possible_initial_responses: [
      'May notice a familiar pattern sooner.',
      'May use a practiced strategy or ask for support.',
    ],
    possible_decision_tendencies: [
      'May make room for review rather than treating the first impulse as final.',
      'May support access to voluntary, respectful help.',
    ],
    moderating_factors: [
      'Fit and quality of the helping relationship',
      'Practice, ongoing stress, and access to support',
    ],
    alternative_outcome:
      'Progress may be uneven; the member can retain vulnerabilities while gaining more ways to respond.',
    source_ids: ['S08', 'S09', 'S11'],
  },
  {
    id: 'FE_P049',
    valence: 'positive',
    title: 'Accepted after revealing an important part of themselves',
    domain: 'identity_and_inclusion',
    life_stages: ['adolescence', 'adulthood'],
    exposure_pattern: 'single_event',
    experience:
      'The person disclosed an important identity, belief, or personal history to someone trusted and received care without being reduced to that disclosure.',
    possible_meanings: [
      'I can be known more fully and still belong.',
      'Disclosure can be chosen rather than owed to everyone.',
    ],
    reminder_cues: [
      'A safe invitation to share something personal',
      'Another person worries that honesty will cost belonging',
    ],
    possible_initial_responses: [
      'May share selectively with greater confidence.',
      "May respond patiently to someone else's disclosure.",
    ],
    possible_decision_tendencies: [
      'May favor privacy, voluntary disclosure, and equal participation.',
      'May avoid making group membership depend on personal conformity.',
    ],
    moderating_factors: ['Safety of the current audience', 'Whether acceptance continued after the initial response'],
    alternative_outcome: 'They may choose privacy in some settings even after a deeply affirming experience elsewhere.',
    source_ids: ['S07', 'S11'],
  },
  {
    id: 'FE_P050',
    valence: 'positive',
    title: 'Caregiving became a supported and meaningful role',
    domain: 'caregiving_and_responsibility',
    life_stages: ['adulthood'],
    exposure_pattern: 'extended_period',
    experience:
      'While caring for someone, the person received practical help, shared decisions, and protected time for their own needs.',
    possible_meanings: [
      'Care can be meaningful without requiring complete self-erasure.',
      'Sharing responsibility can improve care for everyone.',
    ],
    reminder_cues: [
      'A team proposes a realistic care schedule',
      'Someone offers relief before exhaustion becomes severe',
    ],
    possible_initial_responses: ['May state limits and accept assistance.', 'May coordinate responsibilities openly.'],
    possible_decision_tendencies: [
      'May support shared workloads and dependable respite.',
      'May accept a caring role when resources and boundaries are workable.',
    ],
    moderating_factors: ['Changing needs of the person receiving care', 'Reliability of the support network'],
    alternative_outcome:
      'They may still find caregiving difficult and may step back when needs exceed available capacity.',
    source_ids: ['S01', 'S11'],
  },
];
