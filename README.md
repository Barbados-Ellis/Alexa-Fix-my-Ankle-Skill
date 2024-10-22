The objective of this project is to provide an Alexa skill which aids in the recovery of patients ages 18-40 years from the fictional OPS clinic who have injured their ankle to the point where surgery was necessary. The aim is to provide each patient with a tailor-made experience along their journey back to maximum body function; providing patients with a user-friendly interface i.e., an “exercise companion”. 


NOTE: Before trying to host/ test the skill you must note the following:

  SOME SKILL FUNCTIONALITY WONT WORK SINCE SOME BACKEND FUNCTIONS (DYNAMODB AND S3 BUCKET) ARE HOSTED IN MY PRIVATE AWS ACCOUNT


USER GUDE:


i) HOW TO: Activate the skill 

To activate the skill, simply say “Alexa, Fix my ankle”. If your Alexa is already awake, you can just say “Fix my ankle”. These phrases will invoke the skill and you will be greeted with a welcome message. 


ii) HOW TO: Choose an Ability Level 

Ability levels dictate the intensity of the exercise you will be performing.  Each ability level corresponds to a stage of the user’s recovery. The skill has 3 levels to choose from: 
 
      Beginner 

      Intermediate 

      Advanced 

To choose an ability level, say one of the following phrases: 

      “{Level} is my level” 

      “I am a {Level}” 

      “I am {Level}” 

      “I am {Level} level” 

For example, if you are a beginner, i.e., in the early stages of post operational recovery, you could say “I am a Beginner”. 

Below are some synonyms that could be used in place of levels stated above.  

      Beginner: Easy, Newbie, Noob 

      Intermediate: Average 

      Advanced: Expert, difficult Experienced 

 

iii) HOW TO: Choose an Exercise 

(Only) After you have chosen an ability level, you will be able to choose the exercise you want to do. To do so, try the following phrases: 

      “I want to do {Exercise}” 

      “{Exercise}” 

For example, if you wish to do jump rope, you can say “I want to do jump rope” or simply “Jump rope”. Doing so will prompt Alexa to provide you with a jump rope workout containing a number of reps and sets relevant to your ability level. 

The exercises available on the Fix My Ankle skill along with synonyms that they can be referenced by are seen below: 

      Jump Rope: Rope, skipping rope, Skipping 

      Step up: Step 

      Resisted range of motion: Banded range of motion 

      Calf stretch 

*REMINDER*  

An exercise can only be chosen after an ability level has been selected. 


iv) HOW TO: Get a List Of Equipment Needed 

To get a list of equipment needed, simply say the following phrases: 

      “What do I need for {Exercise}” 

      “What do I need to do {Exercise}” 

For example, if you would like to know what is needed to complete step ups, you would say “What do I need to do {Step Ups} 

 

v) HOW TO: Play A Demo Video 

To play a demonstration video for a particular exercise, say on of the following: 

      “Play demo video {video number}” 

      “Play video {video number}” 

The following is a Table which matches each exercise to its respective video number. 

      Jump Rope: 1 

      Step Up: 2 

      Resisted Range of motion: 3 

      Standing calf stretch: 4 
