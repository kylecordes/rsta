
function runApp() {
	
	var lframe = new JFrame("Congrats you are logged in!");
	lframe.setSize(500, 300);

	lframe.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	
	var button = new JButton("Done");

	button.addActionListener( function() {
		dispose();
	});

	var panel = new JPanel();
	panel.border = BorderFactory.createEmptyBorder(30, 30, 10, 30);
	panel.setLayout(new java.awt.GridLayout(0, 1));
	panel.add(button);

	lframe.add(panel);
	lframe.pack();
	lframe.show();
}

