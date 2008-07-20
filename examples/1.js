
importPackage(Packages.javax.swing);

frame = new JFrame("My New Window");
frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
frame.setSize(200,200);

panel = new JPanel();

button = new JButton("Click Me");

function clicked() {
	print("button was clicked");
}

button.addActionListener(clicked);

panel.add(button);

frame.add(panel);
frame.pack();
frame.show();

