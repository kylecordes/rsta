// Rhino Swing Test Application
// Copyright 2008 Kyle Cordes
// http://kylecordes.com




importPackage(Packages.javax.swing);
importPackage(Packages.java.awt);
importPackage(Packages.java.awt.event);

var frame = new JFrame("Rhino Swing Test Application");
frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
frame.setSize(300, 200);

var labelPrefix = "Button clicks: ";
var numClicks = 0;
var label = new JLabel(labelPrefix + numClicks);
var button = new JButton("Count Another Click");
button.mnemonic = KeyEvent.VK_I;

button.addActionListener( function() {
	numClicks += 1;
	label.setText(labelPrefix + numClicks);
});

label.setLabelFor(button);

var panel = new JPanel();
panel.border = BorderFactory.createEmptyBorder(30, 30, 10, 30);
panel.setLayout(new GridLayout(0, 1));
panel.add(button);
panel.add(label);

frame.add(panel);
frame.pack();
frame.show();
