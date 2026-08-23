'use strict';

/**
 * Single source of truth for every fact on the site.
 * Copy was carried over from the previous mountainmdft.com (Wix) build,
 * with typos corrected and stale dates removed. Anything that could not be
 * verified from the old site is marked with a REVIEW comment.
 */

const site = {
  name: 'Mountain Maryland Firearms Training',
  shortName: 'Mountain Maryland Firearms Training',
  origin: 'https://www.mountainmdft.com',
  tagline: 'Maryland HQL, Wear & Carry, and NRA firearms training in Frostburg.',
  description:
    'HQL, Wear & Carry, and NRA firearms courses in Frostburg, MD, taught by a Maryland ' +
    'State Police Qualified Handgun Instructor and retired Trooper.',

  phone: '240-727-1932',
  phoneHref: '+12407271932',

  address: {
    street: '79 S Grant St',
    locality: 'Frostburg',
    region: 'MD',
    postalCode: '21532',
    country: 'US',
  },

  /**
   * Opening hours, Monday first. `opens`/`closes` are 24-hour local time and feed
   * the LocalBusiness structured data; `label` is what visitors read. The business
   * is in America/New_York, which is also how "today" is highlighted on the page.
   */
  timezone: 'America/New_York',
  hours: [
    { day: 'Monday',    short: 'Mon', closed: true },
    { day: 'Tuesday',   short: 'Tue', opens: '12:00', closes: '18:00', label: '12–6 PM' },
    { day: 'Wednesday', short: 'Wed', opens: '12:00', closes: '18:00', label: '12–6 PM' },
    { day: 'Thursday',  short: 'Thu', opens: '12:00', closes: '18:00', label: '12–6 PM' },
    { day: 'Friday',    short: 'Fri', opens: '12:00', closes: '17:00', label: '12–5 PM' },
    { day: 'Saturday',  short: 'Sat', opens: '09:00', closes: '13:00', label: '9 AM–1 PM' },
    { day: 'Sunday',    short: 'Sun', closed: true },
  ],

  facebook:
    'https://www.facebook.com/Mountain-Maryland-Firearms-Training-213395412173858/',

  // The old site had no published email address. Set one here and it appears
  // across the site automatically; leave null to show phone-only contact.
  email: null,

  /**
   * The contact form posts here. Formspree (or any form-to-email service) works
   * with a plain static host — no server required. Replace with the real
   * endpoint before launch; while it is null the form renders as a mailto/phone
   * fallback instead of silently dropping submissions.
   */
  formEndpoint: null,

  areaServed: [
    'Frostburg, MD',
    'Cumberland, MD',
    'Allegany County',
    'Garrett County',
    'Western Maryland',
  ],
};

/** Ordered nav. `primary: true` puts an item in the top-level desktop bar. */
const nav = [
  { label: 'Home', href: '/', primary: true },
  { label: 'Courses', href: '/courses/', primary: true },
  { label: 'The Shop', href: '/shop/', primary: true },
  { label: 'Your Instructor', href: '/instructor/', primary: true },
  { label: 'FAQ', href: '/faq/', primary: true },
  { label: 'Contact', href: '/contact/', primary: true },
];

/**
 * Every course the business offers. The four NRA/private courses at the bottom
 * existed on the old site but were not linked from any menu, so nobody could
 * find them — they are in the Courses index now.
 */
const courses = [
  {
    slug: 'md-hql-class',
    title: 'Maryland HQL Class',
    fullTitle: 'Maryland Handgun Qualification License (HQL) Course',
    short: 'Required before you can buy a handgun in Maryland.',
    price: '$75',
    priceValue: '75',
    length: '4 hours',
    prereq: 'No prior experience required.',
    featured: true,
    badge: 'Most popular',
    image: 'hql',
    metaTitle: 'Maryland HQL Class in Frostburg, MD — $75, 4 Hours',
    metaDescription:
      'The 4-hour Maryland Handgun Qualification License course required for new handgun ' +
      'purchasers. Taught in Frostburg, MD. $75 per person.',
    intro:
      'The required 4-hour course for new purchasers of handguns in Maryland. ' +
      'Certain exceptions apply. This class meets the State of Maryland’s training ' +
      'requirement to apply for your HQL.',
    sections: [
      {
        heading: 'What you’ll cover',
        list: [
          'Classroom instruction',
          'Pistol knowledge and operation',
          'Pistol action types',
          'Rules for safe gun handling and use',
          'Ammunition knowledge',
          'Fundamentals of pistol shooting',
          'Introduction to Maryland firearms laws',
          'Selecting your first pistol',
          'Maintenance and storage',
          'The application process',
          'Dry-fire and live-fire session',
        ],
      },
    ],
    notes: [
      'Does <strong>not</strong> include the required digital LiveScan fingerprinting, ' +
        'which is normally available onsite.',
    ],
  },

  {
    slug: 'md-wear-carry-training',
    title: 'MD Wear & Carry Training',
    fullTitle: 'Maryland Wear and Carry Permit Course — Original Application',
    short: '16-hour course required for a first-time Maryland carry permit.',
    price: 'Call for pricing',
    length: '16 hours',
    prereq: 'For original (first-time) permit applications.',
    featured: true,
    image: 'wearcarry',
    metaTitle: 'Maryland Wear & Carry Permit Training — 16 Hours, Frostburg MD',
    metaDescription:
      'MSP-approved 16-hour Maryland Wear and Carry permit training for original ' +
      'applications, taught in Frostburg by a Qualified Handgun Instructor.',
    intro:
      'Wear and Carry permit training at Mountain Maryland Firearms Training is taught by ' +
      'a Maryland State Police approved Qualified Handgun Instructor with an account on the ' +
      'Maryland State Police MyLicense/E-Gov site. An original application requires 16 hours ' +
      'of instruction; a renewal requires 8.',
    sections: [
      {
        heading: 'What the approved training includes',
        list: [
          'State firearm law',
          'Home firearm safety',
          'Handgun mechanisms and operation',
          'A live-fire component requiring a minimum score of 70% accuracy',
        ],
      },
      {
        heading: 'Before you apply',
        body:
          'Under the 2013 Firearms Safety Act, effective October 1, 2013, the training ' +
          'requirements changed for all Maryland Wear and Carry permit holders. Make sure you ' +
          'have successfully completed the required training <em>before</em> you submit an ' +
          'original, renewal, or subsequent application.',
      },
    ],
    notes: [
      'Attending the class does not guarantee issuance of a permit. The class is one of ' +
        'several requirements to apply.',
    ],
    // wear-carry-class takes over as soon as its file exists; until then the
    // range photo stands in.
    photo: ['wear-carry-class', 'range-lesson'],
    photoCaption: 'Classroom instruction and live-fire qualification are both part of the course.',
    checklist: true,
  },

  {
    slug: 'md-wear-carry-renewal',
    title: 'MD Wear & Carry Renewal',
    fullTitle: 'Maryland Wear and Carry Permit Course — Renewal',
    short: '8-hour hands-on course to qualify for your permit renewal.',
    price: '$150',
    priceValue: '150',
    length: '8 hours',
    prereq: 'For renewing an existing Maryland Wear and Carry permit.',
    featured: true,
    image: 'renewal',
    metaTitle: 'Maryland Wear & Carry Renewal Course — $150, 8 Hours',
    metaDescription:
      'The 8-hour hands-on shooting course for Maryland Wear and Carry permit renewal, ' +
      'taught in Frostburg, MD. $150 per person, loaner firearms available.',
    intro:
      'A hands-on shooting course designed to give you the tools required to successfully ' +
      'qualify for a Maryland handgun permit renewal.',
    sections: [
      {
        heading: 'What you’ll learn',
        list: [
          'Firearms safety',
          'Firearms law and legal liability',
          'Carrying and transporting firearms in Maryland and other states',
          'Deadly force defined, and when to use it',
          'Avoiding a criminal attack and controlling a violent confrontation',
          'Handgun nomenclature',
          'Ammunition types and ballistics',
          'Handgun shooting fundamentals',
          'Practical pistol shooting positions',
        ],
      },
      {
        heading: 'Included',
        list: ['Classroom training', 'Multiple laser training systems (if necessary)'],
      },
      {
        heading: 'Not included',
        list: [
          'Application fee paid to the Maryland State Police by check or money order — currently $50',
          'Ammunition: minimum 25 rounds to qualify (available through the instructor for an additional cost if needed)',
          'Handgun (loaner firearms available through the instructor on request, subject to availability)',
        ],
      },
    ],
    notes: [
      'Successfully passing this course does not guarantee that your wear and carry permit ' +
        'renewal will be approved.',
    ],
    photo: 'range-lesson',
    photoCaption: 'One-on-one coaching through the shooting qualification.',
  },

  {
    slug: 'range-safety-officer',
    title: 'NRA Range Safety Officer',
    fullTitle: 'NRA Range Safety Officer (RSO) Certification',
    short: 'Certification course for those who will supervise a range.',
    price: 'Call for pricing',
    length: 'Contact us for the current schedule',
    prereq: 'Open to those who will supervise shooting activities on a range.',
    image: 'rso',
    metaTitle: 'NRA Range Safety Officer Certification — Frostburg, MD',
    metaDescription:
      'NRA Range Safety Officer (RSO) certification course taught by an NRA Certified ' +
      'instructor in Frostburg, Maryland. Call 240-727-1932 for the next scheduled date.',
    intro:
      'The NRA Range Safety Officer course prepares you to supervise shooting activities ' +
      'safely and confidently, whether on a club range, at a training event, or as part of ' +
      'a shooting program. It is taught here by an NRA Certified Range Safety Officer.',
    sections: [
      {
        heading: 'Typical course topics',
        list: [
          'Roles and responsibilities of a Range Safety Officer',
          'Range standard operating procedures',
          'Range inspection and rules',
          'Firearm stoppages and malfunctions',
          'Emergency procedures',
        ],
      },
    ],
    notes: [
      'Course dates are scheduled on demand. Call <a href="tel:+12407271932">240-727-1932</a> ' +
        'for the next available date and current pricing.',
    ],
    photo: 'rso-coaching',
    photoCaption:
      'A Range Safety Officer supervising the firing line and coaching a shooter through a string.',
  },

  {
    slug: 'basic-pistol',
    title: 'NRA Basics of Pistol Shooting',
    fullTitle: 'NRA Basics of Pistol Shooting',
    short: 'The knowledge, skills, and attitude for owning and using a pistol safely.',
    price: 'Call for pricing',
    length: 'Contact us for the current schedule',
    prereq: 'Open to all adults regardless of previous shooting experience or NRA affiliation.',
    image: 'pistol',
    metaTitle: 'NRA Basics of Pistol Shooting Course — Frostburg, MD',
    metaDescription:
      'NRA Basics of Pistol Shooting, an instructor-led course covering safe handgun ' +
      'ownership and use, taught in Frostburg, Maryland. All experience levels welcome.',
    intro:
      'The NRA Basics of Pistol Shooting is an instructor-led training (ILT) course that ' +
      'teaches the knowledge, skills, and attitude necessary for owning and using a pistol ' +
      'safely. The course is intended for all adults regardless of previous shooting ' +
      'experience or NRA affiliation.',
    sections: [
      {
        heading: 'Topics include, but are not limited to',
        list: [
          'Gun safety rules',
          'Proper operation of revolvers and semi-automatic handguns',
          'Ammunition selection and knowledge',
          'Selecting and storing a handgun',
          'Basic shooting fundamentals',
        ],
      },
      {
        heading: 'How the course runs',
        body:
          'An NRA Certified Instructor teaches gun safety rules, range protocol, proper ' +
          'handling, loading and unloading procedures, and the application of pistol shooting ' +
          'fundamentals, followed by a live-fire and written test.',
      },
    ],
    notes: [
      'To receive a certificate, students must score 90% or better on the written test and ' +
        'pass the shooting qualification.',
    ],
  },

  {
    slug: 'basic-rifle',
    title: 'NRA Basics of Rifle Shooting',
    fullTitle: 'NRA Basics of Rifle Shooting',
    short: 'The knowledge, skills, and attitude for owning and using a rifle safely.',
    price: 'Call for pricing',
    length: 'Contact us for the current schedule',
    prereq:
      'Open to all adults, or minors accompanied by an adult, regardless of previous ' +
      'shooting experience or NRA affiliation.',
    image: 'rifle',
    metaTitle: 'NRA Basics of Rifle Shooting Course — Frostburg, MD',
    metaDescription:
      'NRA Basics of Rifle Shooting, an instructor-led course covering safe rifle ownership ' +
      'and use, taught in Frostburg, Maryland. Adults and accompanied minors welcome.',
    intro:
      'The NRA Basics of Rifle Shooting is an instructor-led training (ILT) course that ' +
      'teaches the knowledge, skills, and attitude necessary for owning and using a rifle ' +
      'safely. The course is intended for all adults, or minors accompanied by an adult, ' +
      'regardless of previous shooting experience or NRA affiliation.',
    sections: [
      {
        heading: 'Topics include, but are not limited to',
        list: [
          'Gun safety rules',
          'Proper operation of bolt, pump, semi-automatic, and lever action rifles',
          'Ammunition selection and knowledge',
          'Selecting and storing a rifle',
          'Basic shooting fundamentals',
        ],
      },
      {
        heading: 'How the course runs',
        body:
          'An NRA Certified Instructor teaches gun safety rules, range protocol, proper ' +
          'handling, loading and unloading procedures, and the application of rifle shooting ' +
          'fundamentals, followed by a live-fire and written test.',
      },
    ],
    notes: [
      'To receive a certificate, students must score 90% or better on the written test and ' +
        'pass the shooting qualification.',
    ],
  },

  {
    slug: 'private-training',
    title: 'Private Training (1-on-1)',
    fullTitle: 'Private Training — One on One',
    short: 'Sessions built around exactly what you want to work on.',
    price: 'Call for pricing',
    length: 'Scheduled to suit you',
    prereq: 'Any experience level, from first-time handler to experienced shooter.',
    image: 'private',
    metaTitle: 'Private 1-on-1 Firearms Training — Frostburg, MD',
    metaDescription:
      'Private one-on-one firearms lessons in Frostburg, Maryland, from basic handling ' +
      'through advanced gun drills, built around each student’s needs.',
    intro:
      'Mountain Maryland Firearms Training offers private lessons and sessions. Available ' +
      'training ranges from very basic firearms handling, use, and knowledge through to ' +
      'advanced gun drills. Each scenario is based on the individual student’s needs and goals.',
    sections: [
      {
        heading: 'Good for',
        list: [
          'First-time owners who want to build confidence before a group class',
          'Refreshing skills you have not used in a while',
          'Working on a specific weakness — draw, reload, accuracy, or malfunction drills',
          'Shooters who would simply rather learn one on one',
        ],
      },
    ],
  },

  {
    slug: 'self-defense',
    title: 'Expert Self Defense',
    fullTitle: 'Expert Self Defense — Hapkido',
    short: 'Empty-hand self defense from a 4th Dan Master Instructor.',
    price: 'Call for pricing',
    length: 'Contact us for the current schedule',
    prereq: 'No prior martial arts experience required.',
    image: 'selfdefense',
    metaTitle: 'Expert Self Defense Training (Hapkido) — Frostburg, MD',
    metaDescription:
      'Self defense instruction in the Korean martial art of Hapkido from a Certified ' +
      'Master Instructor and 4th Dan Black Belt in Frostburg, Maryland.',
    intro:
      'John is a Certified Master Instructor and 4th Dan Black Belt in the Korean martial art ' +
      'of Hapkido — a martial art that promotes mind and body coordination coupled with joint ' +
      'manipulation techniques for self defense.',
    sections: [
      {
        heading: 'Why train empty-hand skills',
        body:
          'A firearm is not the answer to every situation, and it is not always within reach. ' +
          'Hapkido fills the gap with control and joint manipulation techniques that work at ' +
          'close range, and it builds the awareness and composure that carry over into every ' +
          'other part of your training.',
      },
    ],
  },
];

/**
 * FAQ. The old site's answers still referred to "prior to October 1, 2013" as a
 * future event and one question had no answer at all; both are fixed here.
 */
const faqs = [
  {
    q: 'How do I apply for a Handgun Qualification License?',
    a:
      'The application process is handled online through the Maryland State Police Licensing ' +
      'Division. You will need to complete an approved firearms safety training course such as ' +
      'our <a href="/courses/md-hql-class/">HQL class</a>, be fingerprinted through an approved ' +
      'LiveScan provider, and then submit your application through the ' +
      '<a href="https://mdsp.maryland.gov/Organization/Pages/CriminalInvestigationBureau/LicensingDivision/Firearms/HandgunQualificationLicense.aspx" ' +
      'rel="noopener">Maryland State Police HQL page</a>.',
  },
  {
    q: 'How will a firearms dealer know that I have a Handgun Qualification License?',
    a:
      'The Maryland State Police will issue you a Handgun Qualification License, which you ' +
      'present to the dealer.',
  },
  {
    q: 'Do I need an HQL to shoot at a gun range?',
    a:
      'No. An HQL is only required to purchase, rent, or transfer a regulated firearm — not to ' +
      'shoot at a range.',
  },
  {
    q:
      'I legally owned a handgun before October 1, 2013. How do I prove I am exempt from the ' +
      'training requirement?',
    a:
      'When applying for your HQL you will be asked for the serial number of a handgun you ' +
      'legally owned before that date. Providing that serial number meets the obligation.',
  },
  {
    q: 'How long is the HQL class, and what does it cost?',
    a:
      'The Maryland HQL course is 4 hours and costs $75 per person. It does not include the ' +
      'required digital LiveScan fingerprinting, which is normally available onsite.',
  },
  {
    q: 'How many hours of training does a Wear and Carry permit require?',
    a:
      'An original (first-time) application requires 16 hours of instruction. A renewal ' +
      'requires 8 hours. Complete the training <em>before</em> you submit your application.',
  },
  {
    q: 'Does passing the class guarantee I get a permit?',
    a:
      'No. Completing the training is one of several requirements to apply. The Maryland State ' +
      'Police decide whether to issue the permit.',
  },
  {
    q: 'Do I need to bring my own handgun and ammunition?',
    a:
      'Loaner firearms are available through the instructor on request, subject to ' +
      'availability. For qualification you will need a minimum of 25 rounds, which are ' +
      'available through the instructor for an additional cost if needed.',
  },
  {
    q: 'How does a new resident register a regulated firearm?',
    a:
      'New Maryland residents should contact the Maryland State Police Licensing Division for ' +
      'the current registration process and deadlines. Call us at ' +
      '<a href="tel:+12407271932">240-727-1932</a> if you would like help understanding what ' +
      'applies to you.',
  },
  {
    q: 'How do I register to instruct the Firearms Safety Training Course?',
    a:
      'Instructor registration is handled through the ' +
      '<a href="https://mdsp.maryland.gov/Organization/Pages/CriminalInvestigationBureau/LicensingDivision/Training/FirearmsSafetyTrainingCourse.aspx" ' +
      'rel="noopener">Maryland State Police Licensing Division</a>.',
  },
];

/**
 * Photo slots. `alt` lives here so it stays with the asset rather than being
 * repeated at each call site, and so a replaced photo cannot keep stale alt text.
 * A slot listed here but not present in public/assets/img is simply skipped at
 * build time — drop the file in and it appears.
 */
const photos = {
  'range-lesson': {
    alt: 'An instructor coaching a student through live-fire practice on the range',
    // Portrait source: in a wide card band this crops vertically, and centre
    // lands on legs. Bias upward to hold the shooter and the targets.
    position: '50% 26%',
  },
  'hero-range': {
    alt: 'A shooter practicing on the range under instruction',
  },
  classroom: {
    alt: 'A full classroom of students during a Mountain Maryland Firearms Training session',
  },
  'wear-carry-class': {
    alt: 'An instructor demonstrating a holster and pistol to a Wear and Carry class',
  },
  'rso-coaching': {
    alt: 'An NRA Range Safety Officer coaching a shooter on the firing line',
  },
  'counter-service': {
    alt: 'A customer being shown a pistol across the shop counter',
    // Wide-ish frame with the subjects centre-right; hold the faces when cropped.
    position: '55% 38%',
  },
  'shop-interior': {
    alt: 'Inside the shop: rifle racks, the Maryland State Police flag, and the Mountain Maryland Firearms Training sign',
    // Pan up to keep the branded counter and the racks behind it in frame.
    position: '50% 40%',
  },
  'gun-wall': {
    alt: 'A row of shotguns and rifles racked along the shop wall',
  },
  trooper: {
    alt: 'John Sagal in Maryland State Police uniform',
  },
  deployment: {
    alt: 'John Sagal deployed in Afghanistan',
  },
  checklist: {
    alt: 'Concealed carry checklist: five steps to a Maryland Wear and Carry permit',
  },
  lawshield: {
    alt: 'U.S. LawShield — Legal Defense for Self Defense',
  },
};

/**
 * The retail side of the business — the shop counter, not the classroom.
 *
 * REVIEW before launch: NFA items (suppressors, SBRs) can only be transferred by
 * a dealer holding an SOT in addition to the FFL. The copy below says these are
 * offered and ordered, which is what the owner described — confirm the exact
 * licensing wording. Transfers for outside purchases are confirmed offered; the
 * fee is not stated anywhere on the site yet, and buyers will ask, so add it to
 * the "Gun transfers" service below when it is settled.
 */
const retail = {
  eyebrow: 'The shop',
  title: 'A full counter, not just a classroom',
  lede:
    'Mountain Maryland Firearms Training is a working gun shop as well as a training ' +
    'provider. Come in and handle what you are considering, ask questions without a ' +
    'sales pitch, and get straight answers from someone who has carried a firearm ' +
    'professionally for thirty years.',
  /**
   * Headline services — what the shop does, as distinct from what it stocks.
   * These lead the shop page because they are what people search for.
   */
  services: [
    {
      icon: 'tag',
      name: 'Buy, sell, trade & consign',
      body:
        'Bring in what you are no longer shooting. We buy outright, take trades against ' +
        'something on the shelf, and take firearms on consignment.',
    },
    {
      icon: 'pin',
      name: 'On-site sales',
      body:
        'Handle it before you buy it. Everything is sold here at the counter in Frostburg, ' +
        'with the paperwork done on site.',
    },
    {
      icon: 'arrow',
      name: 'Gun transfers',
      body:
        'Bought online or out of state? Ship it here and we will handle the FFL transfer ' +
        'and the background check.',
    },
  ],

  categories: [
    {
      icon: 'target',
      name: 'Pistols',
      body: 'Carry guns, full-size duty pistols, revolvers, and rimfire — from budget-friendly to premium.',
    },
    {
      icon: 'shield',
      name: 'Rifles & shotguns',
      body: 'Sporting, hunting, and defensive long guns, including bolt, pump, semi-automatic, and lever actions.',
    },
    {
      icon: 'check',
      name: 'SBRs & NFA items',
      body: 'Short-barreled rifles and other NFA-regulated items, ordered and transferred through the shop.',
    },
    {
      icon: 'hand',
      name: 'Suppressors',
      body: 'Cans for rimfire through centerfire, with help through the ATF paperwork and the wait that comes with it.',
    },
    {
      icon: 'tag',
      name: 'Ammunition & optics',
      body: 'Range and defensive ammunition, optics, lights, and the accessories that actually get used.',
    },
    {
      icon: 'user',
      name: 'Advice that fits you',
      body: 'The right first pistol is the one you will carry and practice with. We will help you find it.',
    },
  ],
  note:
    'Stock moves constantly, and anything not on the shelf can usually be ordered. ' +
    'Call <a href="tel:+12407271932">240-727-1932</a> to check current availability ' +
    'before making the drive.',
  nfaNote:
    'NFA transfers — suppressors and SBRs — involve ATF paperwork and a waiting period. ' +
    'We will walk you through the process and keep you posted while it runs.',
};

/**
 * Manufacturers carried. Rendered as text wordmarks until a logo file exists at
 * public/assets/img/brands/<slug>.(svg|png) — drop one in and it takes over, the
 * same way photo slots work. Only list brands actually carried, and only display
 * a manufacturer's logo where their dealer terms allow it.
 */
const brands = [];

/** Instructor bio, lightly copy-edited from the old "Meet our Trainers" page. */
const instructor = {
  name: 'John Sagal',
  role: 'Owner / Lead Instructor',
  photo: 'trooper',
  intro:
    'My name is John Sagal. I am the owner and operator of Mountain Maryland Firearms ' +
    'Training, formerly known as Boston Hill Training. I am an avid hunter and fisherman, a ' +
    'lifelong resident of Allegany County, Maryland, and a veteran of the United States Air Force.',
  paragraphs: [
    'I performed duties as a Security Policeman and Heavy Weapons operator (81mm mortar, ' +
      '.50 cal machine gun, and 90mm recoilless rifle), and served as an Emergency Services ' +
      'Team (EST) hostage rescue and counter-terrorism team member and leader while stationed ' +
      'in South Korea. I am also a retired Maryland State Police Trooper.',
    'Upon my retirement from the Maryland State Police, I served in Afghanistan during ' +
      'Operation Enduring Freedom (OEF) as a civilian contractor embedded with the U.S. ' +
      'military in several provinces, from Helmand to Mazar-e-Sharif.',
    'I am eager to share my training, experience, and knowledge with my clients at Mountain ' +
      'Maryland Firearms Training.',
  ],
  credentials: [
    'Maryland State Police certified Qualified Handgun Instructor',
    'Retired Maryland State Police Trooper',
    'United States Air Force veteran — Security Police, Heavy Weapons, EST',
    'NRA Certified Range Safety Officer',
    'NRA Certified Basic Pistol Instructor',
    'NRA Certified Basic Rifle Instructor',
    'Maryland certified Hunter Safety Instructor',
    '4th Dan Black Belt, Master Instructor in Hapkido, under Grand Master Chang Yong Sil',
    'Certified in numerous weapons systems; PSD (Personal Security Detail) operator',
  ],
};

module.exports = { site, nav, courses, faqs, instructor, photos, retail, brands };
