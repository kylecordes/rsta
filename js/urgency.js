// Rhino Swing Test Application
// Copyright 2008 Kyle Cordes
// http://kylecordes.com


/*
 * This hands out 4 colors, in decreasing order of how 
 * "urgent" they look.
 */

function make(baseColor, desaturation) {
	var comps = Color.RGBtoHSB(baseColor.getRed(), baseColor.getGreen(),
			baseColor.getBlue(), null);
	return Color.getHSBColor(comps[0], comps[1] / desaturation, comps[2]);
}

var colors = [
	make(Color.RED, 4),
	make(new Color(0xffd9b3), 1),
	make(Color.YELLOW, 4),
	make(Color.GREEN, 4)
];

function getUrgencyColor(urgency) {
	return colors[urgency - 1];
}
