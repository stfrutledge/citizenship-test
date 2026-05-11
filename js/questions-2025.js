/**
 * 2025 USCIS Citizenship Test Questions
 * 128 questions - effective for applications filed on or after October 20, 2025
 * Test format: 20 questions asked, 12 correct needed to pass
 *
 * Questions marked with is65_20: true are for the 65/20 exemption
 * (applicants 65+ with 20+ years as permanent resident)
 */

const QUESTIONS_2025 = [
  // AMERICAN GOVERNMENT - Principles of American Government
  {
    id: 1,
    question: "What is the form of government of the United States?",
    answers: ["Republic", "Constitution-based federal republic", "Representative democracy"],
    category: "American Government",
    subcategory: "Principles of American Government",
    is65_20: false
  },
  {
    id: 2,
    question: "What is the supreme law of the land?",
    answers: ["The Constitution"],
    category: "American Government",
    subcategory: "Principles of American Government",
    is65_20: true
  },
  {
    id: 3,
    question: "What does the Constitution do?",
    answers: ["Forms the government", "Defines the government", "Defines the powers of government", "Defines the parts of government", "Protects the rights of the people"],
    category: "American Government",
    subcategory: "Principles of American Government",
    is65_20: false
  },
  {
    id: 4,
    question: "The U.S. Constitution starts with the words \"We the People.\" What does \"We the People\" mean?",
    answers: ["Self-government", "Popular sovereignty", "Consent of the governed", "People should govern themselves", "The power of government comes from the people"],
    category: "American Government",
    subcategory: "Principles of American Government",
    is65_20: false
  },
  {
    id: 5,
    question: "How are changes made to the U.S. Constitution?",
    answers: ["Amendments", "The amendment process"],
    category: "American Government",
    subcategory: "Principles of American Government",
    is65_20: false
  },
  {
    id: 6,
    question: "What does the Bill of Rights protect?",
    answers: ["The basic rights of Americans", "The basic rights of people living in the United States"],
    category: "American Government",
    subcategory: "Principles of American Government",
    is65_20: false
  },
  {
    id: 7,
    question: "How many amendments does the U.S. Constitution have?",
    answers: ["Twenty-seven (27)"],
    category: "American Government",
    subcategory: "Principles of American Government",
    is65_20: true
  },
  {
    id: 8,
    question: "Why is the Declaration of Independence important?",
    answers: ["It says America is free from British control", "It says all people are created equal", "It identifies inherent rights", "It identifies individual freedoms"],
    category: "American Government",
    subcategory: "Principles of American Government",
    is65_20: false
  },
  {
    id: 9,
    question: "What founding document said the American colonies were free from Britain?",
    answers: ["Declaration of Independence"],
    category: "American Government",
    subcategory: "Principles of American Government",
    is65_20: false
  },
  {
    id: 10,
    question: "Name two important ideas from the Declaration of Independence and the U.S. Constitution.",
    answers: ["Equality", "Liberty", "Social contract", "Natural rights", "Limited government", "Self-government"],
    category: "American Government",
    subcategory: "Principles of American Government",
    is65_20: false
  },
  {
    id: 11,
    question: "The words \"Life, Liberty, and the pursuit of Happiness\" are in what founding document?",
    answers: ["Declaration of Independence"],
    category: "American Government",
    subcategory: "Principles of American Government",
    is65_20: false
  },
  {
    id: 12,
    question: "What is the economic system of the United States?",
    answers: ["Capitalism", "Free market economy", "Market economy"],
    category: "American Government",
    subcategory: "Principles of American Government",
    is65_20: true
  },
  {
    id: 13,
    question: "What is the rule of law?",
    answers: ["Everyone must follow the law", "Leaders must obey the law", "Government must obey the law", "No one is above the law"],
    category: "American Government",
    subcategory: "Principles of American Government",
    is65_20: false
  },
  {
    id: 14,
    question: "Many documents influenced the U.S. Constitution. Name one.",
    answers: ["Declaration of Independence", "Articles of Confederation", "Federalist Papers", "Anti-Federalist Papers", "Virginia Declaration of Rights", "Fundamental Orders of Connecticut", "Mayflower Compact", "Iroquois Great Law of Peace"],
    category: "American Government",
    subcategory: "Principles of American Government",
    is65_20: false
  },
  {
    id: 15,
    question: "There are three branches of government. Why?",
    answers: ["So no branch is too powerful", "Checks and balances", "Separation of powers"],
    category: "American Government",
    subcategory: "Principles of American Government",
    is65_20: false
  },

  // AMERICAN GOVERNMENT - System of Government
  {
    id: 16,
    question: "Name the three branches of government.",
    answers: ["Legislative, executive, and judicial", "Congress, president, and the courts"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 17,
    question: "The President of the United States is in charge of which branch of government?",
    answers: ["Executive branch"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 18,
    question: "What part of the federal government writes laws?",
    answers: ["Congress", "Senate and House of Representatives", "U.S. legislature", "Legislative branch"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 19,
    question: "What are the two parts of the U.S. Congress?",
    answers: ["The Senate and the House of Representatives"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 20,
    question: "Name one power of the U.S. Congress.",
    answers: ["Writes laws", "Declares war", "Makes the federal budget"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: true
  },
  {
    id: 21,
    question: "How many U.S. senators are there?",
    answers: ["One hundred (100)"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 22,
    question: "How long is a term for a U.S. senator?",
    answers: ["Six (6) years"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 23,
    question: "Who are your state's U.S. senators now?",
    answers: ["Cory Booker", "Andy Kim"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 24,
    question: "How many voting members are in the House of Representatives?",
    answers: ["Four hundred thirty-five (435)"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 25,
    question: "How long is a term for a member of the House of Representatives?",
    answers: ["Two (2) years"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 26,
    question: "Why do U.S. representatives serve shorter terms than U.S. senators?",
    answers: ["To more closely follow public opinion"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 27,
    question: "How many senators does each state have?",
    answers: ["Two (2)"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 28,
    question: "Why does each state have two senators?",
    answers: ["Equal representation for small states", "The Great Compromise", "The Connecticut Compromise"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 29,
    question: "Who is one of your state's U.S. representatives now?",
    answers: ["Thomas Kean Jr."],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 30,
    question: "Who is the Speaker of the House of Representatives now?",
    answers: ["Mike Johnson"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: true
  },
  {
    id: 31,
    question: "Who does a U.S. senator represent?",
    answers: ["Citizens of their state", "All people of their state"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 32,
    question: "Who elects U.S. senators?",
    answers: ["Citizens of their state"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 33,
    question: "Who does a member of the House of Representatives represent?",
    answers: ["Citizens in their congressional district", "All people in their congressional district"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 34,
    question: "Who elects members of the House of Representatives?",
    answers: ["Citizens in their congressional district"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 35,
    question: "Some states have more representatives than other states. Why?",
    answers: ["Because of the state's population", "Because they have more people", "Because some states have more people"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 36,
    question: "How long is a presidential term?",
    answers: ["Four (4) years"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: true
  },
  {
    id: 37,
    question: "The President can only serve two terms. Why?",
    answers: ["Because of the 22nd Amendment", "To keep the President from becoming too powerful"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 38,
    question: "What is the name of the President of the United States now?",
    answers: ["Donald Trump", "Donald J. Trump", "Trump"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: true
  },
  {
    id: 39,
    question: "What is the name of the Vice President of the United States now?",
    answers: ["JD Vance", "J.D. Vance", "Vance"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: true
  },
  {
    id: 40,
    question: "If the President can no longer serve, who becomes President?",
    answers: ["The Vice President"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 41,
    question: "Name one power of the President.",
    answers: ["Signs bills into law", "Vetoes bills", "Enforces laws", "Commander in Chief of the military", "Chief diplomat"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 42,
    question: "Who is the Commander in Chief of the U.S. military?",
    answers: ["The President"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 43,
    question: "Who signs bills to become laws?",
    answers: ["The President"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 44,
    question: "Who vetoes bills?",
    answers: ["The President"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: true
  },
  {
    id: 45,
    question: "Who appoints federal judges?",
    answers: ["The President"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 46,
    question: "The executive branch has many parts. Name one.",
    answers: ["President", "Cabinet", "Federal departments and agencies"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 47,
    question: "What does the President's Cabinet do?",
    answers: ["Advises the President"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 48,
    question: "What are two Cabinet-level positions?",
    answers: ["Secretary of Agriculture", "Secretary of Commerce", "Secretary of Defense", "Secretary of Education", "Secretary of Energy", "Secretary of Health and Human Services", "Secretary of Homeland Security", "Secretary of Housing and Urban Development", "Secretary of the Interior", "Secretary of Labor", "Secretary of State", "Secretary of Transportation", "Secretary of the Treasury", "Secretary of Veterans Affairs", "Attorney General", "Vice President"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 49,
    question: "Why is the Electoral College important?",
    answers: ["It decides who is elected President", "It provides a compromise between the popular vote and congressional selection"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 50,
    question: "What is one part of the judicial branch?",
    answers: ["Supreme Court", "Federal courts"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 51,
    question: "What does the judicial branch do?",
    answers: ["Reviews laws", "Explains laws", "Resolves disputes", "Decides if a law goes against the Constitution"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 52,
    question: "What is the highest court in the United States?",
    answers: ["The Supreme Court"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: true
  },
  {
    id: 53,
    question: "How many seats are on the Supreme Court?",
    answers: ["Nine (9)"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 54,
    question: "How many Supreme Court justices are usually needed to decide a case?",
    answers: ["Five (5)"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 55,
    question: "How long do Supreme Court justices serve?",
    answers: ["For life", "Lifetime appointment", "Until retirement"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 56,
    question: "Supreme Court justices serve for life. Why?",
    answers: ["To be independent of politics", "To limit outside influence"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 57,
    question: "Who is the Chief Justice of the United States now?",
    answers: ["John Roberts", "John G. Roberts Jr."],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 58,
    question: "Name one power that is only for the federal government.",
    answers: ["Print money", "Mint coins", "Declare war", "Create an army", "Make treaties", "Set foreign policy"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 59,
    question: "Name one power that is only for the states.",
    answers: ["Provide schooling and education", "Provide protection (police)", "Provide safety (fire departments)", "Give a driver's license", "Approve zoning and land use"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 60,
    question: "What is the purpose of the 10th Amendment?",
    answers: ["It states that the powers not given to the federal government belong to the states or the people"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },
  {
    id: 61,
    question: "Who is the governor of your state now?",
    answers: ["Mikie Sherrill"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: true
  },
  {
    id: 62,
    question: "What is the capital of your state?",
    answers: ["Trenton"],
    category: "American Government",
    subcategory: "System of Government",
    is65_20: false
  },

  // AMERICAN GOVERNMENT - Rights and Responsibilities
  {
    id: 63,
    question: "There are four amendments to the U.S. Constitution about who can vote. Describe one of them.",
    answers: ["Citizens eighteen (18) and older can vote", "You don't have to pay a poll tax to vote", "Any citizen can vote (women and men can vote)", "A male citizen of any race can vote"],
    category: "American Government",
    subcategory: "Rights and Responsibilities",
    is65_20: false
  },
  {
    id: 64,
    question: "Name one right only for United States citizens.",
    answers: ["Vote in a federal election", "Run for federal office", "Serve on a jury"],
    category: "American Government",
    subcategory: "Rights and Responsibilities",
    is65_20: false
  },
  {
    id: 65,
    question: "Name three rights of everyone living in the United States.",
    answers: ["Freedom of expression", "Freedom of speech", "Freedom of assembly", "Freedom to petition the government", "Freedom of religion", "The right to bear arms"],
    category: "American Government",
    subcategory: "Rights and Responsibilities",
    is65_20: false
  },
  {
    id: 66,
    question: "What do we show loyalty to when we say the Pledge of Allegiance?",
    answers: ["The United States", "The flag"],
    category: "American Government",
    subcategory: "Rights and Responsibilities",
    is65_20: true
  },
  {
    id: 67,
    question: "Name two promises that new citizens make in the Oath of Allegiance.",
    answers: ["Give up loyalty to other countries", "Defend the Constitution and laws of the United States", "Obey the laws of the United States", "Serve in the U.S. military if needed", "Serve the nation if needed", "Be loyal to the United States"],
    category: "American Government",
    subcategory: "Rights and Responsibilities",
    is65_20: false
  },
  {
    id: 68,
    question: "How can people become United States citizens?",
    answers: ["Be born in the United States", "Naturalize", "Derive citizenship from parents"],
    category: "American Government",
    subcategory: "Rights and Responsibilities",
    is65_20: false
  },
  {
    id: 69,
    question: "What are two ways that Americans can participate in their democracy?",
    answers: ["Vote", "Run for office", "Join a political party", "Help with a campaign", "Join a civic group", "Join a community group", "Give elected officials your opinion on an issue", "Contact elected officials", "Support or oppose an issue or policy", "Write to a newspaper"],
    category: "American Government",
    subcategory: "Rights and Responsibilities",
    is65_20: false
  },
  {
    id: 70,
    question: "What are two ways that Americans can serve their country?",
    answers: ["Vote", "Pay taxes", "Obey the law", "Serve in the military", "Run for office", "Work for local, state, or federal government"],
    category: "American Government",
    subcategory: "Rights and Responsibilities",
    is65_20: false
  },
  {
    id: 71,
    question: "Why is it important to pay federal taxes?",
    answers: ["Required by law", "All people pay to fund the federal government", "Required by the 16th Amendment", "Civic duty"],
    category: "American Government",
    subcategory: "Rights and Responsibilities",
    is65_20: false
  },
  {
    id: 72,
    question: "It is important for all men ages 18 through 25 to register for the Selective Service. Name one reason why.",
    answers: ["Required by law", "Civic duty", "It makes the draft fair if needed"],
    category: "American Government",
    subcategory: "Rights and Responsibilities",
    is65_20: false
  },

  // AMERICAN HISTORY - Colonial Period and Independence
  {
    id: 73,
    question: "Colonists came to America for many reasons. Name one.",
    answers: ["Freedom", "Political liberty", "Religious freedom", "Economic opportunity", "To practice their religion", "To escape persecution"],
    category: "American History",
    subcategory: "Colonial Period and Independence",
    is65_20: false
  },
  {
    id: 74,
    question: "Who lived in America before the Europeans arrived?",
    answers: ["American Indians", "Native Americans"],
    category: "American History",
    subcategory: "Colonial Period and Independence",
    is65_20: true
  },
  {
    id: 75,
    question: "What group of people was taken and sold as slaves?",
    answers: ["Africans", "People from Africa"],
    category: "American History",
    subcategory: "Colonial Period and Independence",
    is65_20: false
  },
  {
    id: 76,
    question: "What war did the Americans fight to win independence from Britain?",
    answers: ["American Revolution", "The Revolutionary War", "War for Independence"],
    category: "American History",
    subcategory: "Colonial Period and Independence",
    is65_20: false
  },
  {
    id: 77,
    question: "Why did the Americans declare independence from Britain?",
    answers: ["High taxes", "Taxation without representation", "British soldiers stayed in Americans' houses", "They did not have self-government", "Boston Massacre", "Boston Tea Party", "Stamp Act", "Sugar Act", "Townshend Acts", "Intolerable Acts"],
    category: "American History",
    subcategory: "Colonial Period and Independence",
    is65_20: false
  },
  {
    id: 78,
    question: "Who wrote the Declaration of Independence?",
    answers: ["Thomas Jefferson"],
    category: "American History",
    subcategory: "Colonial Period and Independence",
    is65_20: true
  },
  {
    id: 79,
    question: "When was the Declaration of Independence adopted?",
    answers: ["July 4, 1776"],
    category: "American History",
    subcategory: "Colonial Period and Independence",
    is65_20: false
  },
  {
    id: 80,
    question: "Name one important event during the American Revolution.",
    answers: ["Battle of Bunker Hill", "Declaration of Independence", "Washington Crossing the Delaware", "Battle of Saratoga", "Valley Forge", "Battle of Yorktown"],
    category: "American History",
    subcategory: "Colonial Period and Independence",
    is65_20: false
  },
  {
    id: 81,
    question: "The American colonies had 13 original states. Name five.",
    answers: ["New Hampshire", "Massachusetts", "Rhode Island", "Connecticut", "New York", "New Jersey", "Pennsylvania", "Delaware", "Maryland", "Virginia", "North Carolina", "South Carolina", "Georgia"],
    category: "American History",
    subcategory: "Colonial Period and Independence",
    is65_20: false
  },
  {
    id: 82,
    question: "What founding document was written in 1787?",
    answers: ["The Constitution", "U.S. Constitution"],
    category: "American History",
    subcategory: "Colonial Period and Independence",
    is65_20: false
  },
  {
    id: 83,
    question: "The Federalist Papers supported the passage of the U.S. Constitution. Name one of the writers.",
    answers: ["James Madison", "Alexander Hamilton", "John Jay", "Publius"],
    category: "American History",
    subcategory: "Colonial Period and Independence",
    is65_20: false
  },
  {
    id: 84,
    question: "Why is The Federalist Papers important?",
    answers: ["It helped people understand the Constitution", "It supported passing the Constitution"],
    category: "American History",
    subcategory: "Colonial Period and Independence",
    is65_20: false
  },
  {
    id: 85,
    question: "Benjamin Franklin is famous for many things. Name one.",
    answers: ["Founded the first free libraries", "First Postmaster General of the United States", "Helped write the Declaration of Independence", "Inventor", "U.S. diplomat"],
    category: "American History",
    subcategory: "Colonial Period and Independence",
    is65_20: false
  },
  {
    id: 86,
    question: "George Washington is famous for many things. Name one.",
    answers: ["Father of Our Country", "First President of the United States", "General of the Continental Army", "President of the Constitutional Convention"],
    category: "American History",
    subcategory: "Colonial Period and Independence",
    is65_20: true
  },
  {
    id: 87,
    question: "Thomas Jefferson is famous for many things. Name one.",
    answers: ["Wrote the Declaration of Independence", "Third President of the United States", "Doubled the size of the United States (Louisiana Purchase)", "First Secretary of State", "Founded the University of Virginia", "Wrote the Virginia Statute on Religious Freedom"],
    category: "American History",
    subcategory: "Colonial Period and Independence",
    is65_20: false
  },
  {
    id: 88,
    question: "James Madison is famous for many things. Name one.",
    answers: ["Father of the Constitution", "Fourth President of the United States", "President during the War of 1812", "One of the writers of the Federalist Papers"],
    category: "American History",
    subcategory: "Colonial Period and Independence",
    is65_20: false
  },
  {
    id: 89,
    question: "Alexander Hamilton is famous for many things. Name one.",
    answers: ["First Secretary of the Treasury", "One of the writers of the Federalist Papers", "Helped establish the First Bank of the United States", "Aide to General George Washington", "Member of the Continental Congress"],
    category: "American History",
    subcategory: "Colonial Period and Independence",
    is65_20: false
  },

  // AMERICAN HISTORY - 1800s
  {
    id: 90,
    question: "What territory did the United States buy from France in 1803?",
    answers: ["The Louisiana Territory", "Louisiana"],
    category: "American History",
    subcategory: "1800s",
    is65_20: false
  },
  {
    id: 91,
    question: "Name one war fought by the United States in the 1800s.",
    answers: ["War of 1812", "Mexican-American War", "Civil War", "Spanish-American War"],
    category: "American History",
    subcategory: "1800s",
    is65_20: false
  },
  {
    id: 92,
    question: "What is the name of the war between the North and the South?",
    answers: ["The Civil War"],
    category: "American History",
    subcategory: "1800s",
    is65_20: false
  },
  {
    id: 93,
    question: "Name one important event that happened during the Civil War.",
    answers: ["Fort Sumter", "Emancipation Proclamation", "Battle of Vicksburg", "Battle of Gettysburg", "Sherman's March", "Surrender at Appomattox", "Battle of Antietam / Sharpsburg", "Lincoln was assassinated"],
    category: "American History",
    subcategory: "1800s",
    is65_20: false
  },
  {
    id: 94,
    question: "Abraham Lincoln is famous for many things. Name one.",
    answers: ["Freed the slaves (Emancipation Proclamation)", "Saved (or preserved) the Union", "Led the United States during the Civil War", "16th President of the United States", "Delivered the Gettysburg Address"],
    category: "American History",
    subcategory: "1800s",
    is65_20: true
  },
  {
    id: 95,
    question: "What did the Emancipation Proclamation do?",
    answers: ["Freed the slaves", "Freed slaves in the Confederacy", "Freed slaves in the Confederate states", "Freed slaves in most Southern states"],
    category: "American History",
    subcategory: "1800s",
    is65_20: false
  },
  {
    id: 96,
    question: "What U.S. war ended slavery?",
    answers: ["The Civil War"],
    category: "American History",
    subcategory: "1800s",
    is65_20: false
  },
  {
    id: 97,
    question: "What amendment gives citizenship to all persons born in the United States?",
    answers: ["14th Amendment"],
    category: "American History",
    subcategory: "1800s",
    is65_20: false
  },
  {
    id: 98,
    question: "When did all men get the right to vote?",
    answers: ["After the Civil War", "During Reconstruction", "With the 15th Amendment", "1870"],
    category: "American History",
    subcategory: "1800s",
    is65_20: false
  },
  {
    id: 99,
    question: "Name one leader of the women's rights movement in the 1800s.",
    answers: ["Susan B. Anthony", "Elizabeth Cady Stanton", "Sojourner Truth", "Harriet Tubman", "Lucretia Mott", "Lucy Stone"],
    category: "American History",
    subcategory: "1800s",
    is65_20: false
  },

  // AMERICAN HISTORY - Recent American History
  {
    id: 100,
    question: "Name one war fought by the United States in the 1900s.",
    answers: ["World War I", "World War II", "Korean War", "Vietnam War", "Gulf War"],
    category: "American History",
    subcategory: "Recent American History",
    is65_20: false
  },
  {
    id: 101,
    question: "Why did the United States enter World War I?",
    answers: ["Because Germany attacked U.S. (civilian) ships", "To support the Allies (England, France, Italy, and Russia)", "To oppose the Central Powers (Germany, Austria-Hungary, the Ottoman Empire, and Bulgaria)"],
    category: "American History",
    subcategory: "Recent American History",
    is65_20: false
  },
  {
    id: 102,
    question: "When did women get the right to vote?",
    answers: ["1920", "After World War I", "With the 19th Amendment"],
    category: "American History",
    subcategory: "Recent American History",
    is65_20: false
  },
  {
    id: 103,
    question: "What was the Great Depression?",
    answers: ["Longest economic recession in modern history"],
    category: "American History",
    subcategory: "Recent American History",
    is65_20: false
  },
  {
    id: 104,
    question: "When did the Great Depression start?",
    answers: ["The Great Crash (1929)", "Stock market crash of 1929"],
    category: "American History",
    subcategory: "Recent American History",
    is65_20: false
  },
  {
    id: 105,
    question: "Who was President during the Great Depression and World War II?",
    answers: ["Franklin Roosevelt", "FDR", "Franklin D. Roosevelt"],
    category: "American History",
    subcategory: "Recent American History",
    is65_20: false
  },
  {
    id: 106,
    question: "Why did the United States enter World War II?",
    answers: ["Bombing of Pearl Harbor", "The Japanese attacked Pearl Harbor", "To support the Allies (England, France, and Russia)", "To oppose the Axis Powers (Germany, Italy, and Japan)"],
    category: "American History",
    subcategory: "Recent American History",
    is65_20: false
  },
  {
    id: 107,
    question: "Dwight Eisenhower is famous for many things. Name one.",
    answers: ["General during World War II", "President at the end of the Korean War", "34th President of the United States", "Signed the Federal-Aid Highway Act of 1956 (Created the Interstate System)"],
    category: "American History",
    subcategory: "Recent American History",
    is65_20: false
  },
  {
    id: 108,
    question: "Who was the main rival of the United States during the Cold War?",
    answers: ["Soviet Union", "USSR", "Russia"],
    category: "American History",
    subcategory: "Recent American History",
    is65_20: false
  },
  {
    id: 109,
    question: "During the Cold War, what was one main concern of the United States?",
    answers: ["Communism", "Nuclear war"],
    category: "American History",
    subcategory: "Recent American History",
    is65_20: false
  },
  {
    id: 110,
    question: "Why did the United States enter the Korean War?",
    answers: ["To stop the spread of communism"],
    category: "American History",
    subcategory: "Recent American History",
    is65_20: false
  },
  {
    id: 111,
    question: "Why did the United States enter the Vietnam War?",
    answers: ["To stop the spread of communism"],
    category: "American History",
    subcategory: "Recent American History",
    is65_20: false
  },
  {
    id: 112,
    question: "What did the civil rights movement do?",
    answers: ["Fought to end racial discrimination"],
    category: "American History",
    subcategory: "Recent American History",
    is65_20: false
  },
  {
    id: 113,
    question: "Martin Luther King, Jr. is famous for many things. Name one.",
    answers: ["Fought for civil rights", "Worked for equality for all Americans", "Worked so that people would be judged by their character and not by the color of their skin"],
    category: "American History",
    subcategory: "Recent American History",
    is65_20: true
  },
  {
    id: 114,
    question: "Why did the United States enter the Persian Gulf War?",
    answers: ["To force the Iraqi military from Kuwait"],
    category: "American History",
    subcategory: "Recent American History",
    is65_20: false
  },
  {
    id: 115,
    question: "What major event happened on September 11, 2001, in the United States?",
    answers: ["Terrorists attacked the United States", "Terrorists hijacked planes and crashed them into targets in the United States"],
    category: "American History",
    subcategory: "Recent American History",
    is65_20: true
  },
  {
    id: 116,
    question: "Name one military conflict the United States was involved in after the September 11, 2001, attacks.",
    answers: ["Global War on Terror", "War in Afghanistan", "War in Iraq"],
    category: "American History",
    subcategory: "Recent American History",
    is65_20: false
  },
  {
    id: 117,
    question: "Name one American Indian tribe in the United States.",
    answers: ["Apache", "Blackfeet", "Cherokee", "Cheyenne", "Chippewa", "Choctaw", "Creek", "Crow", "Hopi", "Lakota", "Mohawk", "Navajo", "Oneida", "Pueblo", "Seminole", "Sioux"],
    category: "American History",
    subcategory: "Recent American History",
    is65_20: false
  },
  {
    id: 118,
    question: "Name one example of an American innovation.",
    answers: ["Light bulb", "Automobile", "Skyscrapers", "Airplane", "Assembly line", "Moon landing", "Integrated circuit (IC)"],
    category: "American History",
    subcategory: "Recent American History",
    is65_20: false
  },

  // SYMBOLS AND HOLIDAYS - Symbols
  {
    id: 119,
    question: "What is the capital of the United States?",
    answers: ["Washington, D.C."],
    category: "Symbols and Holidays",
    subcategory: "Symbols",
    is65_20: false
  },
  {
    id: 120,
    question: "Where is the Statue of Liberty?",
    answers: ["New York Harbor", "Liberty Island", "New Jersey", "Near New York City", "On the Hudson River"],
    category: "Symbols and Holidays",
    subcategory: "Symbols",
    is65_20: false
  },
  {
    id: 121,
    question: "Why does the flag have 13 stripes?",
    answers: ["Because there were 13 original colonies", "Because the stripes represent the original colonies"],
    category: "Symbols and Holidays",
    subcategory: "Symbols",
    is65_20: true
  },
  {
    id: 122,
    question: "Why does the flag have 50 stars?",
    answers: ["Because there is one star for each state", "Because each star represents a state", "Because there are 50 states"],
    category: "Symbols and Holidays",
    subcategory: "Symbols",
    is65_20: false
  },
  {
    id: 123,
    question: "What is the name of the national anthem?",
    answers: ["The Star-Spangled Banner"],
    category: "Symbols and Holidays",
    subcategory: "Symbols",
    is65_20: false
  },
  {
    id: 124,
    question: "The Nation's first motto was \"E Pluribus Unum.\" What does that mean?",
    answers: ["Out of many, one"],
    category: "Symbols and Holidays",
    subcategory: "Symbols",
    is65_20: false
  },

  // SYMBOLS AND HOLIDAYS - Holidays
  {
    id: 125,
    question: "What is Independence Day?",
    answers: ["A holiday to celebrate U.S. independence from Britain", "The country's birthday"],
    category: "Symbols and Holidays",
    subcategory: "Holidays",
    is65_20: false
  },
  {
    id: 126,
    question: "Name three national U.S. holidays.",
    answers: ["New Year's Day", "Martin Luther King Jr. Day", "Presidents' Day", "Memorial Day", "Juneteenth", "Independence Day", "Labor Day", "Columbus Day", "Veterans Day", "Thanksgiving", "Christmas"],
    category: "Symbols and Holidays",
    subcategory: "Holidays",
    is65_20: true
  },
  {
    id: 127,
    question: "What is Memorial Day?",
    answers: ["A holiday to honor soldiers who died in military service"],
    category: "Symbols and Holidays",
    subcategory: "Holidays",
    is65_20: false
  },
  {
    id: 128,
    question: "What is Veterans Day?",
    answers: ["A holiday to honor people who served in the military", "A holiday to honor people who have served in the military"],
    category: "Symbols and Holidays",
    subcategory: "Holidays",
    is65_20: false
  }
];

// 65/20 questions for 2025 test (20 questions)
const QUESTIONS_2025_65_20 = QUESTIONS_2025.filter(q => q.is65_20);
