
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






var lframe = new JFrame("Login You Dummy");
lframe.setSize(400, 300);

var button = new JButton("Do It");

button.addActionListener( function() {
});

var panel = new JPanel();
panel.border = BorderFactory.createEmptyBorder(30, 30, 10, 30);
panel.setLayout(new java.awt.GridLayout(0, 1));
panel.add(button);

lframe.add(panel);
lframe.pack();
lframe.show();




