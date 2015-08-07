ScalingBabel

--

touchscreen based combat

Modes of touching
	Swipe/Tap
	Tap without swiping
	Circle around
	Hold
		Stationary (stay inside circle)
		Mobile (stay inside circle as circle moves)
		
Visceral
	visualizing the 'electric' clang via comic/cartoon-like 'slash' effect

LifeCycle
	Draw enemyattack
		Random range time limit
		turn red and narrower as time limit approaches
	Listen for user input
	If time limit is up and
		user succesfully blocks
			block animation
		user does nothing or fails at blocking
			damage taken animation
			health goes down

Important functions
	this.timer = this.time.create(false);
    this.timer.start();
	somenumbervariable=this.timer.ms;
	line drawing
		this.add.graphics(0,0);
		this.someline.lineStyle
		this.someline.moveTo
		this.someline.lineTo
		this.someline.alpha
		
		
		
/*
        explanation of this particular pseudo randomness
        the longer you get a 0, the more likely it is that you'll get a 1 the next time
        the math:
            1/x + 2/x + 3/x + ... + n/x = 100% = 1
            n^2+n-2x=0
            solve for n, and only pick the positive number and you get...
            n=sqrt(8x+1)/2-0.5
        every 
        so by the time you hit 'n' seconds, the cumulative chance
        */