// Rhino Swing Test Application
// Copyright 2008 Kyle Cordes
// http://kylecordes.com

function runApp() {
	
	var lframe = new JFrame("Rhine Swing Test Application - Main Screen");
	lframe.setSize(500, 400);

	lframe.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	
	var exitButton = new JButton("Done");
	exitButton.addActionListener( function() {
		java.lang.System.exit(0);
	});

	var labelPrefix = "Clicks: ";
	var numClicks = 0;
	var label = new JLabel(labelPrefix + numClicks);
	var countButton = new JButton("Count Another Click");
	countButton.mnemonic = KeyEvent.VK_I;

	countButton.addActionListener( function() {
		numClicks += 1;
		label.setText(labelPrefix + numClicks);
	});

	var panel = new JPanel();
	panel.border = BorderFactory.createEmptyBorder(30, 30, 10, 30);
	panel.setLayout(new java.awt.GridLayout(0, 2, 10, 10));

	panel.add(label);
	panel.add(countButton);

	panel.add(new JLabel("Whizbang animation:"));
	panel.add(new JButton("Lets' do it"));

	panel.add(new JLabel("Done yet?"));
	panel.add(exitButton);

	lframe.add(panel);
	lframe.pack();
	lframe.show();
}

