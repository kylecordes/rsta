// Rhino Swing Test Application
// Copyright 2008 Kyle Cordes
// http://kylecordes.com

function runApp() {
	
	var lframe = new JFrame("Rhine Swing Test Application - Main Screen");
	lframe.setSize(500, 300);

	lframe.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	
	var button = new JButton("Done");

	button.addActionListener( function() {
		//dispose();
		close();
	});

	var panel = new JPanel();
	panel.border = BorderFactory.createEmptyBorder(30, 30, 10, 30);
	panel.setLayout(new java.awt.GridLayout(0, 1));
	panel.add(button);

	lframe.add(panel);
	lframe.pack();
	lframe.show();
}

