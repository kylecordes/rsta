// Rhino Swing Test Application
// Copyright 2008 Kyle Cordes
// http://kylecordes.com

// The Runner class automatically runs the contents of this
// file; use it to bootstrap the real code (in other files).

importPackage(Packages.javax.swing);
importPackage(Packages.javax.swing.border);
importPackage(Packages.java.awt.event);
importPackage(Packages.java.awt);
importPackage(Packages.java.util);


intf.load("login.js");
intf.load("main.js");
intf.load("randomdata.js");
intf.load("urgency.js");
intf.load("flying.js");

// This works fine with JGoodies Looks:
// UIManager.setLookAndFeel("com.jgoodies.looks.plastic.PlasticLookAndFeel");

/*
if(login()) {
	runApp();
} else {
	java.lang.System.exit(0);
}
*/

var w1 = new WorkOrder(1, "123 mwm", "staplet", 2);

var lframe = new JFrame("dummy");
lframe.setSize(500, 400);
lframe.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
var panel =createWorkOrderPanel(w1); 
lframe.add(panel);
lframe.pack();
lframe.show();

