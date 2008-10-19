/* Rhino Swing Test Application
 * Kyle Cordes
 * http://kylecordes.com
 *
 * This is a wedge I created while experimenting
 * with hooking JS handlers to Java classes.
 */


package com.kylecordes.rhinohack;

import java.awt.event.ActionEvent;

import javax.swing.AbstractAction;

@SuppressWarnings("serial")
public class RhinoAction extends AbstractAction {

	@Override
	public void actionPerformed(ActionEvent e) {
		act(e);
	}

	public void act(ActionEvent e) {
		// Do Nothing by default
	}

}
