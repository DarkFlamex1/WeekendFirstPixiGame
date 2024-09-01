# August 25th's - Trying to make a game in one weekend with a 2D renderer
Welcome! As the title says, this is a repository holding the remake of one of my first ever platformer game I created in pygame. 
This file iself is a WIP and will be updated with additional information.


# Tech Stack
- PixiJS for 2D renderer

# Workflow
I'm noting down how I attempted to learn to work with Pixi & some of the nuggets of wisdom related to learning/building with speed. These are mostly personalized for me as everyone learns in a different fashion - but feel free to take a gander and see if anything could help you!

I started w/ the Getting Started section of https://pixijs.com/8.x/guides/basics/getting-started#TODO
- the first few commits are related to just getting setup with a node http-server & playing around to get a better understanding of the underlying architecture


# game design
Warning - this is not meant to be a fun game... Well I would love for it to be fun, but it wasn't a focus here!

The game itself is very simple, the player is represented by a simple colored square. They can use WASD to perform actions(movement and jump).
They need to get to the end point(green point), to make it past the current level. The only difficulty comes from the red blocks which will cause the player to lose a life/restart at the start.
That's it! I can't find the original pygame code or game, but I do remember playing around with networking a "ghost" of friends playing and storing a timer for speedrunning - we will see if we've got time for that.

# learnings - unfiltered 

## jest-setup + game-refactor
- learned how to setup github actions workflow
- setup a simple test framework in JS using jest, and began structuring out unit tests
- learning a lot more about planning and tacklilng issues using the rubber-ducking approach w/ claude/chatgpt
- learning a bit about structuring multiple systems even in a simple project like this
- collision detection is crazy, I'm just using simple AABB testing and will implement a better broad phase system
- i'm starting to understand the approach behind ECS and how pragmatic it sounds when you're building an engine - not a goal here
- this github actions workflow is enough for me, but it made me interested in whether i should dig into larger CI pipelines for learning
- always decouple rendering from internal game loop - that's not done in this branch...