// Kyle's very basic Swing app

importPackage(Packages.javax.swing);
importPackage(Packages.java.awt);
importPackage(Packages.java.awt.event);

var frame = new JFrame("Rhino Swing Test gApplication");
frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
frame.setSize(300, 200);

var labelPrefix = "Number of button clicks: ";
var numClicks = 0;
var label = new JLabel(labelPrefix + numClicks);
var button = new JButton("I'm a Swing button!");
button.mnemonic = KeyEvent.VK_I;

button.addActionListener( function() {
	numClicks += 1;
	label.setText(labelPrefix + numClicks);
});
label.setLabelFor(button);

var pane = new JPanel();
pane.border = BorderFactory.createEmptyBorder(30, 30, 10, 30);
pane.setLayout(new GridLayout(0, 1));
pane.add(button);
pane.add(label);

button = new JButton("Click Me");

function clicked() {
	print("button was clicked");
}

button.addActionListener(clicked);

frame.add(pane);
frame.pack();
frame.show();
