# Spartan WOD (Workout of the Day) Generator

As a Spartan Race finisher, I'm a big fan of minimalist workouts, particularly HIIT workouts. 
Spartan.com used to email me a daily WOD and it was a nice way of keeping myself accountable. 
I would not remove the email from my inbox until I had done it. It was a nice easy TODO list.

But then I stopped receiving the emails, and I'm not sure who is at fault there.

Then I heard about a data science project to map cultural cuisines by examining recipes. 

Spartan WODs are essentially recipes. You take "ingredients" (exercises) and measure them (sets/reps/duration), 
and put them together to get a dish (WOD). So I wondered if I could create a probabilistic model and generate new
workouts given old ones.

In addition, Spartan WODs often had elements of things I could never do, like swimming or trail running, because I lack
resources like pools and trails. So I wanted to be able to select my resources or preferences
and get a tailored workout based on that.

## Calories

I needed a way to measure workout intensity, and the obvious choice was by measuring calories burned. 
Unfortunately, this is easire said than done. Calories burned depends on heart rate, your body weight,
muscles invoked, and a lot of other factors that just don't lend themselves to easy calculation. So, this is admittedly 
some guess work.

I googled calories burned for each exercise. Sometimes it was easy to find, sometimes not. Almost always though, I had to
convert measurements into how I am measuring things. Discrete exercises with a start and end position, such as burpees, are measured in reps. 
Continuous exercises, such as cycling or running, are divided into distance or duration. Since running is slightly more discrete, I measure it in distances of miles. 
Cycling and swimming is measured in duration.
Of course actual calories burned will vary with how high you're getting your heart rate, but we need some way of calculating the "intensity" so this was my compromise. 

## Caveats

Inevitably, not all human-generated WODs had a 1:1 mapping to my model. Sometimes, there were "or" conditions ("jog or jumprope for 10 minutes"). Sometimes, the instructions
were fluffy (uphill sprints, start out walking, build to a sprint), etc. So I ended up compromising on a lot of these. When given the choice between jogging/running or something that 
required equipment (like jumproping), I always chose the thing without equipment.

Some instructions used duration instead of distance. I had originally planned on this, but I decided it would be easier if I kept discrete (countable) exercises as reps, 
traveling exercises (running, swimming, etc) as distance, and non-traveling, non-discrete exercises (planks) as duration.

This required some strong guessing when it comes to translating something like, "do one minute of pushups" to a discrete number. I basically just took a guess at what I can do
in that time and that became my number of reps. But the training data isn't really the point. That can be changed to whatever you want, really. The point here was
the probabilistic model built around Spartan-style WODs. 
