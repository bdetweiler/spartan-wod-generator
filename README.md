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
