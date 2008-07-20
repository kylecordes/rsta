importPackage(java.awt, java.awt.event)
importPackage(Packages.javax.swing)
importClass(java.lang.System)

// the main frame of the GUI:
// consists of a tabbed pane to which other panels for additional employee
// information may be entered
function MainFrame() {
	var cp = this.contentPane
	var tabbedPane = new JTabbedPane

	this.gip = new GeneralInfoPanel
	tabbedPane.addTab(this.gip.id, this.gip.infoPanel)
	this.pp = new PublicationsPanel
	tabbedPane.addTab(this.pp.id, this.pp.pubPanel)

	var compMap = {}
	compMap[this.gip.id] = this.gip
	compMap[this.pp.id] = this.pp

	var buttonPanel = new JPanel(new GridLayout(1, 3))
	var addButton = new JButton("Add")
	var clearButton = new JButton("Clear")
	var exitButton = new JButton("Exit")

	addButton.setMnemonic(KeyEvent.VK_A)
	addButton.addActionListener(new JavaAdapter(ActionListener, {
		actionPerformed : function(event) {
			compMap[tabbedPane.selectedComponent.name].doAdd()
		}
	}))
	buttonPanel.add(addButton)

	clearButton.setMnemonic(KeyEvent.VK_R)
	clearButton.addActionListener(new JavaAdapter(ActionListener, {
		actionPerformed : function(event) {
			compMap[tabbedPane.selectedComponent.name].clearFields()
		}
	}))
	buttonPanel.add(clearButton)

	exitButton.setMnemonic(KeyEvent.VK_X)
	exitButton.addActionListener(new JavaAdapter(ActionListener, {
		actionPerformed : function(event) {
			var confirm = JOptionPane.showConfirmDialog(cp, "Confirm exit",
					"Confirm Exit Dialog", JOptionPane.YES_NO_OPTION)
			if (confirm == JOptionPane.YES_OPTION) {
				System.exit(0)
			}
		}
	}))
	buttonPanel.add(exitButton)

	cp.add(tabbedPane, BorderLayout.CENTER)
	cp.add(buttonPanel, BorderLayout.SOUTH)
} // MainFrame
MainFrame.prototype = new JFrame

// display GUI
main = new MainFrame("Employee Record Example")
main.setSize(400, 400)
main.visible = true
