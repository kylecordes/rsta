var layeredPane = new JLayeredPane();
var dialog = new JDialog();
var loggedIn = false;

function go() {
	dialog.dispose();
	loggedIn = true;
}

var okAction = new AbstractAction({
	//super("Log In", null);    // There is no way to do this in Rhino. Sorry.
	actionPerformed: function () {
		go();
	}
});

importClass(java.lang.Integer);

okAction.putValue(Action.NAME, "Log In");
okAction.putValue(Action.SHORT_DESCRIPTION, "This is a button to login");
okAction.putValue(Action.MNEMONIC_KEY, Integer.valueOf(KeyEvent.VK_O));

var picHeight = 260;
var picWidth = 450;

layeredPane.setPreferredSize(new Dimension(picWidth, picHeight));
layeredPane.setBorder(BorderFactory.createEmptyBorder());



function createImageIcon(path) {
	var someClass = new Frame(); 
	someClass = someClass.getClass();
	var imgURL = someClass.getResource(path);
	if (imgURL != null) {
		return new ImageIcon(imgURL);
	} else {
		intf.print("Couldn't find file: " + path);
		return null;
	}
}

var image = createImageIcon("/logo.jpg");
var picture = new JLabel(image);
picture.setBounds(0, 0, picWidth, 260);
layeredPane.add(picture);

var userName = new JTextField(15);
layeredPane.add(userName, Integer.valueOf(10));
userName.setBounds(320, 40, 100, 20);

userName.getInputMap().put(KeyStroke.getKeyStroke("ENTER"), "go");
userName.getActionMap().put("go", okAction);

var password = new JTextField();
password.setBounds(320, 100, 100, 20);
layeredPane.add(password, Integer.valueOf(10));

var loginButton = new JButton();
loginButton.setBounds(320, 150, 90, 28);
loginButton.setAction(okAction);

layeredPane.add(loginButton, Integer.valueOf(10));

layeredPane.setOpaque(true); // content panes must be opaque
dialog.setTitle("Worldwide Momentum Login");
dialog.setContentPane(layeredPane);
dialog.pack();
dialog.setLocationRelativeTo(null);
dialog.setModal(true);

function login() {
	dialog.setVisible(true);
	return loggedIn;
}
