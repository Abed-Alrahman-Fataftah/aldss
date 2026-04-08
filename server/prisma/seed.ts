import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding learning content...')

  // ─── TRACK 1: Python for Beginners ───────────────────────────────────────
  const pythonTrack = await prisma.track.create({
    data: {
      title: 'Python for Beginners',
      description: 'Learn the fundamentals of Python programming from scratch. Build real skills through practical exercises.',
      orderIndex: 1
    }
  })

  await prisma.module.create({
    data: {
      trackId: pythonTrack.id,
      title: 'Why Python and How to Think Like a Programmer',
      description: 'Understand what Python is, why it matters, and how programmers approach problems differently.',
      orderIndex: 1,
      content: `## Why Python?

Python is one of the most widely used programming languages in the world. It powers data science, web development, automation, and artificial intelligence. More importantly, Python reads almost like plain English — which makes it the best language to learn programming concepts for the first time.

## How Programmers Think

Programming is not about memorizing syntax. It is about breaking problems into small, solvable steps. Consider making a cup of tea. You would not say "make tea" to someone who has never done it. You would say: boil water, place teabag in cup, pour water, wait 3 minutes, remove bag, add sugar if desired.

Programmers call this **decomposition** — breaking a complex task into clear, ordered steps that a computer can follow.

## The Core Mindset

Three habits separate good programmers from struggling ones:

**1. Read error messages carefully.** Errors are not failures — they are instructions. Python tells you exactly what went wrong and on which line.

**2. Test small pieces first.** Do not write 50 lines then run it. Write 5 lines, run it, confirm it works, then continue.

**3. Search before you give up.** Every programmer searches for solutions constantly. This is not cheating — it is professional practice.

## What You Will Build

By the end of this track you will be able to write Python programs that store and manipulate data, make decisions, repeat actions automatically, and solve real problems. Start with curiosity, not pressure.`,
      quizzes: {
        create: [
          {
            question: 'What does decomposition mean in programming?',
            options: JSON.stringify([
              'Writing code as fast as possible',
              'Breaking a complex problem into small, ordered steps',
              'Deleting unnecessary code',
              'Converting Python to another language'
            ]),
            correct: 1,
            explanation: 'Decomposition means breaking a complex task into small, manageable steps that can be solved one at a time — exactly like explaining how to make tea step by step.'
          },
          {
            question: 'What should you do when you see a Python error message?',
            options: JSON.stringify([
              'Restart your computer',
              'Delete the code and start over',
              'Read it carefully — it tells you exactly what went wrong',
              'Ignore it and keep writing more code'
            ]),
            correct: 2,
            explanation: 'Error messages are instructions, not failures. Python tells you exactly what went wrong and on which line. Reading them carefully is the fastest path to fixing the problem.'
          },
          {
            question: 'Which of these best describes the right way to write code?',
            options: JSON.stringify([
              'Write all the code first, then run it once at the end',
              'Write 5 to 10 lines, run it, confirm it works, then continue',
              'Memorize all syntax before writing anything',
              'Only write code you can figure out without searching'
            ]),
            correct: 1,
            explanation: 'Testing small pieces of code as you go is how professional programmers work. It makes errors much easier to find and fix.'
          },
          {
            question: 'Why is Python described as reading like plain English?',
            options: JSON.stringify([
              'Because it was invented in England',
              'Because its syntax is designed to be readable and close to natural language',
              'Because it only works with English text',
              'Because programmers must write comments in English'
            ]),
            correct: 1,
            explanation: 'Python was designed with readability as a core principle. This makes it easier to learn and to understand code written by others.'
          },
          {
            question: 'What is the most important habit for a beginner programmer?',
            options: JSON.stringify([
              'Memorizing as many commands as possible',
              'Writing long programs without testing',
              'Searching for solutions — this is professional practice, not cheating',
              'Avoiding errors at all costs'
            ]),
            correct: 2,
            explanation: 'Every professional programmer searches for solutions constantly. The ability to find, evaluate, and apply solutions is a core programming skill.'
          }
        ]
      }
    }
  })

  await prisma.module.create({
    data: {
      trackId: pythonTrack.id,
      title: 'Variables and Data Types',
      description: 'Learn how Python stores and works with different kinds of information.',
      orderIndex: 2,
      content: `## What is a Variable?

A variable is a named container that stores a value. Think of it like a labelled box — you put something inside, give the box a name, and can open it later to use what is inside.

\`\`\`python
name = "Ahmad"
age = 24
gpa = 3.7
is_enrolled = True
\`\`\`

## The Four Basic Data Types

**String** — text, always in quotes
\`\`\`python
university = "University of Malaya"
message = "Welcome to ALDSS"
\`\`\`

**Integer** — whole numbers
\`\`\`python
year = 2025
students = 120
\`\`\`

**Float** — decimal numbers
\`\`\`python
score = 87.5
gpa = 3.85
\`\`\`

**Boolean** — True or False only
\`\`\`python
is_active = True
has_submitted = False
\`\`\`

## Naming Rules

Variable names must start with a letter or underscore. They cannot contain spaces — use underscores instead. They are case-sensitive: \`Score\` and \`score\` are different variables.

Good names: \`student_name\`, \`total_score\`, \`is_complete\`
Bad names: \`x\`, \`stuff\`, \`data1\`

## Why Good Names Matter

\`\`\`python
# Hard to understand
x = 87.5
y = 50
z = x / y * 100

# Easy to understand
student_score = 87.5
total_marks = 50
percentage = student_score / total_marks * 100
\`\`\`

Both do the same thing. The second one you can read six months later and still understand.`,
      quizzes: {
        create: [
          {
            question: 'What is a variable in Python?',
            options: JSON.stringify([
              'A mathematical equation',
              'A named container that stores a value',
              'A type of error message',
              'A command that runs a program'
            ]),
            correct: 1,
            explanation: 'A variable is a named container. You give it a name, store a value inside it, and use that name to access the value later in your program.'
          },
          {
            question: 'Which of these is a valid Python variable name?',
            options: JSON.stringify([
              '2nd_score',
              'student score',
              'student_score',
              'student-score'
            ]),
            correct: 2,
            explanation: 'Variable names cannot start with a number, cannot contain spaces, and cannot contain hyphens. Underscores are the correct way to separate words.'
          },
          {
            question: 'What data type is the value 3.85?',
            options: JSON.stringify([
              'String',
              'Integer',
              'Float',
              'Boolean'
            ]),
            correct: 2,
            explanation: 'A float is any number with a decimal point. 3.85 is a float. Integers are whole numbers only.'
          },
          {
            question: 'What will this code store in the variable "result"? result = 10 / 4',
            options: JSON.stringify([
              '2 (integer)',
              '2.5 (float)',
              '"10/4" (string)',
              'True (boolean)'
            ]),
            correct: 1,
            explanation: 'In Python 3, dividing two integers with / always produces a float. 10 divided by 4 is 2.5.'
          },
          {
            question: 'Why should variable names be descriptive?',
            options: JSON.stringify([
              'Python requires long variable names to work correctly',
              'Descriptive names make code readable and maintainable over time',
              'Short names cause errors',
              'Python runs faster with descriptive names'
            ]),
            correct: 1,
            explanation: 'Descriptive names make your code readable — by others and by your future self. student_score is instantly understandable. x is not.'
          }
        ]
      }
    }
  })

  // ─── TRACK 2: Data Literacy ───────────────────────────────────────────────
  const dataTrack = await prisma.track.create({
    data: {
      title: 'Data Literacy and Critical Thinking',
      description: 'Learn to read, interpret, and critically evaluate data and statistics in everyday life.',
      orderIndex: 2
    }
  })

  await prisma.module.create({
    data: {
      trackId: dataTrack.id,
      title: 'What is Data and Why Does It Matter',
      description: 'Understand what data really is, where it comes from, and why being data-literate is a critical life skill.',
      orderIndex: 1,
      content: `## Everything is Data

Data is any recorded observation about the world. Your heart rate is data. Your exam score is data. The number of steps you walked today is data. A newspaper headline is data. A photograph is data.

The question is never whether data exists — it always does. The question is whether we know how to read it, question it, and use it responsibly.

## Why Data Literacy Matters Now

We live in the most data-rich period in human history. Every day you encounter:

- Statistics in news articles
- Charts in social media posts
- Graphs in academic papers
- Numbers in government announcements
- Ratings and reviews on products

Most of these are presented as facts. Many of them are misleading — not always intentionally, but because data is easy to misread and easy to misrepresent.

## The Three Questions to Ask

When you see any data claim, ask:

**1. Where did this data come from?**
Who collected it? When? How many people or things were measured? A survey of 50 students is very different from a survey of 50,000.

**2. What is being measured — and what is not?**
Every number measures something specific. A university's ranking measures certain factors and ignores others. A country's GDP measures economic output but not happiness or inequality.

**3. What is the data being compared to?**
A 30% increase sounds impressive. But 30% increase from what? If sales were 10 units and are now 13, that is very different from 10,000 units becoming 13,000.

## Data Without Context is Dangerous

"Students who eat breakfast score 15% higher on exams." This sounds like evidence that breakfast causes better scores. But maybe students who eat breakfast also come from more stable home environments, sleep better, and have more resources. The breakfast might have nothing to do with it.

This is called **confounding** — when a third variable explains the relationship between two others. Spotting confounders is one of the most valuable critical thinking skills you can develop.`,
      quizzes: {
        create: [
          {
            question: 'What does data literacy mean?',
            options: JSON.stringify([
              'The ability to program computers',
              'Knowing how to read, question, and use data responsibly',
              'Memorizing statistics',
              'Only working with numerical information'
            ]),
            correct: 1,
            explanation: 'Data literacy is the ability to read, interpret, evaluate, and communicate with data. It includes knowing when to trust data and when to question it.'
          },
          {
            question: 'A study shows "people who drink coffee live longer." What should you ask first?',
            options: JSON.stringify([
              'How much coffee should I drink?',
              'Where did this data come from and what else might explain it?',
              'Is this study from a university?',
              'What brand of coffee was used?'
            ]),
            correct: 1,
            explanation: 'Before accepting any data claim, ask about its source, sample size, and what other factors might explain the result. Coffee drinkers might also exercise more or have higher incomes.'
          },
          {
            question: 'What is a confounding variable?',
            options: JSON.stringify([
              'A variable that is difficult to measure',
              'A third factor that explains the relationship between two other variables',
              'An error in data collection',
              'A variable with too many values'
            ]),
            correct: 1,
            explanation: 'A confounding variable is a hidden third factor that actually explains the relationship you are observing. Breakfast and exam scores might both be explained by stable home environments.'
          },
          {
            question: '"Sales increased 200% this quarter." Why might this be misleading?',
            options: JSON.stringify([
              'Percentages are always misleading',
              'Without knowing the starting point, a 200% increase could mean very little in absolute terms',
              'The word "quarter" is ambiguous',
              'Sales figures are never accurate'
            ]),
            correct: 1,
            explanation: '200% increase from 1 unit means 3 units. 200% increase from 10,000 units means 30,000 units. Without context, the percentage tells you very little.'
          },
          {
            question: 'Why is it important to ask what data is NOT measuring?',
            options: JSON.stringify([
              'Because missing data is always an error',
              'Because every measurement captures only some aspects of reality and ignores others',
              'Because good datasets measure everything',
              'Because what is not measured does not matter'
            ]),
            correct: 1,
            explanation: 'Every measurement makes choices about what to include and exclude. GDP measures economic output but not wellbeing. University rankings measure certain factors and ignore others. Understanding what is excluded helps you interpret what is included.'
          }
        ]
      }
    }
  })

  // ─── TRACK 3: Productivity ────────────────────────────────────────────────
  const productivityTrack = await prisma.track.create({
    data: {
      title: 'Productivity and Learning Systems',
      description: 'Build evidence-based habits and systems that make consistent learning automatic rather than effortful.',
      orderIndex: 3
    }
  })

  await prisma.module.create({
    data: {
      trackId: productivityTrack.id,
      title: 'Why Most People Study Inefficiently',
      description: 'Understand the science behind why common study habits fail — and what actually works.',
      orderIndex: 1,
      content: `## The Illusion of Learning

Most students study by re-reading notes and highlighting text. These feel productive. Research consistently shows they produce very little actual learning.

The problem is **fluency illusion** — when something feels familiar, your brain mistakes familiarity for understanding. Re-reading a page feels good because the words look familiar. But familiarity is not knowledge.

## What the Research Actually Shows

Decades of cognitive science research have identified the techniques that produce durable learning:

**Retrieval practice** — testing yourself before you feel ready. Closing the book and trying to recall what you just read. Writing down everything you remember before looking at your notes. This feels harder than re-reading, which is exactly why it works — the struggle forces your brain to strengthen the memory.

**Spaced repetition** — reviewing material at increasing intervals rather than in one long session. Studying for 30 minutes on Monday, 20 minutes on Wednesday, and 15 minutes on Saturday produces far better retention than studying for 65 minutes on Monday alone.

**Interleaving** — mixing different topics in a single study session rather than finishing one topic completely before moving to the next. This is uncomfortable because it feels less organized. It produces significantly better long-term retention.

## Why We Resist What Works

The techniques that produce the best learning feel more difficult and less satisfying in the moment. Re-reading feels smooth and comfortable. Self-testing feels frustrating. Our instinct is to choose comfort over effectiveness.

This is called **desirable difficulty** — the idea that introducing certain types of challenge into the learning process improves outcomes even though it makes the process feel harder.

## The Practical Shift

Replace one habit this week: instead of re-reading your notes after a study session, close them and write down everything you can remember. Then check what you missed. The information you could not recall is exactly what you need to study more — your notes just told you where your gaps are.`,
      quizzes: {
        create: [
          {
            question: 'What is the fluency illusion?',
            options: JSON.stringify([
              'The feeling that you are reading too fast',
              'When familiarity with material is mistaken for genuine understanding',
              'A technique for improving reading speed',
              'The illusion that studying is always productive'
            ]),
            correct: 1,
            explanation: 'The fluency illusion occurs when re-reading makes material feel familiar, and your brain mistakes that familiarity for understanding. Familiarity and knowledge are not the same thing.'
          },
          {
            question: 'What is retrieval practice?',
            options: JSON.stringify([
              'Reading your notes multiple times',
              'Highlighting important passages in textbooks',
              'Testing yourself by recalling information before looking at notes',
              'Watching lecture videos again'
            ]),
            correct: 2,
            explanation: 'Retrieval practice means actively recalling information from memory — closing your notes and writing down what you remember. The struggle to recall strengthens the memory far more than passive re-reading.'
          },
          {
            question: 'What is spaced repetition?',
            options: JSON.stringify([
              'Studying the same topic for many hours in one day',
              'Reviewing material at increasing time intervals rather than in one long session',
              'Taking breaks every 25 minutes',
              'Spacing your text out when writing notes'
            ]),
            correct: 1,
            explanation: 'Spaced repetition distributes study sessions over time. Reviewing on Monday, Wednesday, and Saturday produces better retention than studying for the same total time in one session.'
          },
          {
            question: 'Why does interleaving feel uncomfortable?',
            options: JSON.stringify([
              'Because it requires expensive tools',
              'Because mixing topics feels disorganized even though it produces better retention',
              'Because it takes more total time than blocked study',
              'Because teachers do not recommend it'
            ]),
            correct: 1,
            explanation: 'Interleaving mixes different topics in one session, which feels less clean and organized than completing one topic fully before moving on. This discomfort is actually a sign it is working.'
          },
          {
            question: 'What does "desirable difficulty" mean?',
            options: JSON.stringify([
              'Making study material as hard as possible',
              'Introducing specific challenges that feel harder in the moment but improve long-term learning',
              'Choosing the most difficult subjects to study',
              'Avoiding any study technique that feels easy'
            ]),
            correct: 1,
            explanation: 'Desirable difficulty refers to learning techniques that feel harder and less satisfying in the moment — like self-testing — but produce significantly better long-term retention than comfortable techniques like re-reading.'
          }
        ]
      }
    }
  })

  // ─── TRACK 4: Academic Writing ────────────────────────────────────────────
  const writingTrack = await prisma.track.create({
    data: {
      title: 'Academic Research and Writing Skills',
      description: 'Master the skills of academic research, critical reading, and structured academic writing.',
      orderIndex: 4
    }
  })

  await prisma.module.create({
    data: {
      trackId: writingTrack.id,
      title: 'How Academic Research Actually Works',
      description: 'Understand the structure of academic knowledge and how researchers build on each other\'s work.',
      orderIndex: 1,
      content: `## What is Academic Research?

Academic research is the systematic process of investigating questions, collecting evidence, and contributing new knowledge to a field. Unlike a Google search that finds existing information, research creates new information that did not exist before.

Every academic paper you read represents someone's attempt to answer a question that no one had answered before — or to answer an old question better, with more evidence, or in a new context.

## How Knowledge Builds

Academic knowledge is cumulative. Every paper builds on previous papers. When a researcher writes "According to Smith (2019)..." they are connecting their work to the existing foundation of knowledge. This is why citations matter — they show where ideas came from and allow others to trace the chain of evidence.

Think of it as a building. Previous research forms the foundation and walls. Your new research adds a new layer. Without understanding the structure below, you cannot know where to place your contribution.

## The Anatomy of a Research Paper

Most academic papers follow the same structure:

**Abstract** — a 150 to 250 word summary of the entire paper. Read this first to decide if the paper is relevant.

**Introduction** — what is the problem, why does it matter, what gap does this paper fill.

**Literature Review** — what has already been done. This shows the authors know the field.

**Methodology** — how the research was conducted. This allows others to evaluate whether the findings can be trusted.

**Results** — what was found, presented without interpretation.

**Discussion** — what the results mean, how they connect to existing knowledge, what the limitations are.

**Conclusion** — summary and what should be done next.

## How to Read a Paper Efficiently

Do not read from start to finish on your first pass. Read in this order:

1. Title and abstract — decide if it is relevant
2. Conclusion — understand the main finding
3. Introduction — understand the problem and gap
4. Results tables and figures — see the evidence
5. Methodology — evaluate how trustworthy the evidence is
6. Full paper — only if all of the above confirm it is valuable

This saves enormous time and helps you extract the most important information quickly.`,
      quizzes: {
        create: [
          {
            question: 'What makes academic research different from a Google search?',
            options: JSON.stringify([
              'Academic research is always longer',
              'Academic research creates new knowledge rather than finding existing information',
              'Google searches are less reliable',
              'Academic research only uses books'
            ]),
            correct: 1,
            explanation: 'Academic research investigates unanswered questions and produces new knowledge. A Google search finds information that already exists. Research generates the information that eventually gets found in searches.'
          },
          {
            question: 'Why do academic papers include citations?',
            options: JSON.stringify([
              'To make papers look more professional',
              'Because universities require a minimum number of references',
              'To show where ideas came from and connect new work to existing knowledge',
              'To increase the length of the paper'
            ]),
            correct: 2,
            explanation: 'Citations show the chain of evidence behind ideas. They allow readers to trace where claims come from, verify them, and understand how the new research builds on what already exists.'
          },
          {
            question: 'When reading a new research paper efficiently, what should you read first?',
            options: JSON.stringify([
              'The methodology section',
              'The references list',
              'The title and abstract to decide if it is relevant',
              'The full introduction'
            ]),
            correct: 2,
            explanation: 'Start with the title and abstract to quickly determine if the paper is relevant to your needs. Only invest time in reading further if the abstract confirms the paper addresses your question.'
          },
          {
            question: 'What is the purpose of the methodology section?',
            options: JSON.stringify([
              'To summarize the findings of the paper',
              'To list all references used in the research',
              'To explain how the research was conducted so readers can evaluate its trustworthiness',
              'To introduce the research problem'
            ]),
            correct: 2,
            explanation: 'The methodology section explains exactly how the research was conducted. This allows readers to assess whether the methods were appropriate and whether the findings can be trusted.'
          },
          {
            question: 'What does it mean that academic knowledge is cumulative?',
            options: JSON.stringify([
              'Academic papers keep getting longer over time',
              'Each new research study builds on the foundation established by previous research',
              'Researchers repeat the same studies to verify results',
              'Knowledge accumulates in libraries'
            ]),
            correct: 1,
            explanation: 'Cumulative means each new piece of research adds to the existing body of knowledge rather than starting from scratch. Understanding previous work is essential before making a new contribution.'
          }
        ]
      }
    }
  })

  console.log('Seeding complete. 4 tracks and 6 modules created.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())