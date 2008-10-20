// Rhino Swing Test Application
// Copyright 2008 Kyle Cordes
// http://kylecordes.com


function WorkOrder(_id, _address, _product, _urgency) {
	this.id = _id;
	this.address = _address;
	this.product = _product;
	this.urgency = _urgency;
}


function WorkOrderPanelStuff(_workOrder) {
	this.workOrder = _workOrder;

	var gap = BorderFactory.createEmptyBorder(2, 2, 2, 2);

	this.	highlight = function() {
		this.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createLineBorder(Color.YELLOW, 3), gap));
		this.repaint();
	}
	
	this.unHighlight  = function(){
		this.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createLineBorder(Color.BLACK, 1), gap));
		this.repaint();
	}

	this.setup = function() {
		this.setPreferredSize(new Dimension(150, 60));
		this.setSize(this.getPreferredSize());
		this.setLayout(new BoxLayout(this, BoxLayout.PAGE_AXIS));
		this.add(new JLabel("Urgency: " + this.workOrder.urgency));
		this.add(new JLabel(this.workOrder.product));
		this.add(new JLabel(this.workOrder.address));
		this.setBackground(getUrgencyColor(this.workOrder.urgency));
		this.unHighlight();
	}
}

function createWorkOrderPanel(_workOrder) {
	var wop = new JavaAdapter(JPanel, new WorkOrderPanelStuff(_workOrder));
	wop.setup();
	return wop;
}


// Slots object manages the places on the screen where a box can be.

function Slots(_layeredPane) {
	var layeredPane = _layeredPane;
	var points = [];
	
	// I wrote these as consts in Java, no const in JS.
	var LEFT_MARGIN = 30;
	var TOP_MARGIN = 3;
	var RIGHT_MARGIN = 3;
	var BOTTOM_MARGIN = 3;
	var HOR_GAP = 38;
	var VER_GAP = 4;
	var LABEL_LAYER = 5;
	var LABEL_OFFSET_X = -25;
	var samplePanel = createWorkOrderPanel(new WorkOrder(0, "", "", 1));
	var panelHeight = samplePanel.getHeight();
	var panelWidth = samplePanel.getWidth();
	var rowSize = panelHeight + VER_GAP;
	var colSize = panelWidth + HOR_GAP;
	var slotsPerColumn = 0;
	
	this.setupSlots = function(numSlots, height) {
		height -= TOP_MARGIN;
		height -= BOTTOM_MARGIN;
		
		var newStackSize = Math.floor(height / rowSize);
		if (slotsPerColumn == newStackSize)
			return;
		
		slotsPerColumn = newStackSize;
		
		layeredPane.removeAll();
		points = [];

		var sizeX = 0;
		var sizeY = 0;

		for (var i = 0; i < numSlots; i++) {
			var row = i % slotsPerColumn;
			var col = Math.floor(i / slotsPerColumn);

			var x = colSize * col + LEFT_MARGIN;
			var y = rowSize * row + TOP_MARGIN;

			var maxX = x + panelWidth + RIGHT_MARGIN;
			var maxY = y + panelHeight + BOTTOM_MARGIN;

			if (maxX > sizeX)
				sizeX = maxX;

			if (maxY > sizeY)
				sizeY = maxY;

			var point = new Point(x, y);
			points.push(point);

			var labelPoint = point.getLocation();
			labelPoint.translate(LABEL_OFFSET_X, 0);
			var lab = new JLabel("#" + (i + 1) + ":");
			lab.setSize(lab.getPreferredSize());
			lab.setLocation(labelPoint);
			layeredPane.add(lab, LABEL_LAYER);
		}
		layeredPane.setPreferredSize(new Dimension(sizeX, sizeY));
	}

	this.findNearestSlotIndex = function(point) {
		var nearestIndex = 0;
		var nearestPointSoFar = null;
		for (var index=0; index<points.length; index++) {
			var slot = points[index];
			if (nearestPointSoFar == null) {
				nearestPointSoFar = slot;
				nearestIndex = index;
			} else {
				if (point.distanceSq(slot) < point
						.distanceSq(nearestPointSoFar)) {
					nearestPointSoFar = slot;
					nearestIndex = index;
				}
			}
		}
		return nearestIndex;
	}

	this.getPoint = function(i) {
		return points[i];
	}
}


Array.prototype.remove = function(s) {
	for(var i=0;i < this.length; i++ ) {
		if(s==this[i]) this.splice(i, 1);
	}
}

Array.prototype.insert = function( i, v ) {
	return this.splice(i, 0, v);
}

function _OrderingWidget() {
	
	// var is good enough for private variables only
	// accessed by functions in this block. Use "this." for publics
	// or other variables you need to access outside this block.
	
	var panels = [];
	var dragging;
	var grabXoffset;
	var grabYoffset;
	var layeredPane = new JLayeredPane();
	var scrollPane = new JScrollPane(layeredPane);
	var slots = new Slots(layeredPane);
	var moveTimer;

	scrollPane.setBorder(BorderFactory.createEmptyBorder());
	scrollPane.setPreferredSize(new Dimension(800, 500));
	scrollPane.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_NEVER);
	scrollPane.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_ALWAYS);

	var parent = this;
	
	scrollPane.addComponentListener(new ComponentAdapter() {
		componentResized : function(e) {
			parent.resized();
        }
    });

    moveTimer = new javax.swing.Timer(20, function() {
    	parent.driftPositions();
    });
    
	// **************** Mouse Event Handlers ******************
	
    this.setupHandlers = function() {
    	// This must be called after my prototype is set by the JavaAdapter constructor,
    	// so that parent methods like addMouseListener are found.
    	layeredPane.addMouseListener(this);
    	layeredPane.addMouseMotionListener(this);
    }
    
	this.mousePressed = function(e) {
		var c = layeredPane.getComponentAt(e.getPoint());
		if (c instanceof JPanel) {
			dragging = c;
			dragging.highlight();
			layeredPane.setLayer(dragging, 20);
			grabXoffset = e.getX() - c.getX();
			grabYoffset = e.getY() - c.getY();
		}
	}

	this.mouseReleased = function(e) {
		if (dragging != null) {
			layeredPane.setLayer(dragging, 10);
			dragging.unHighlight();
			dragging = null;
			startDrifting();
			this.storeOrder();
		}
	}

	this.mouseClicked = function(e) {
		if (e.getClickCount() == 2) {
            // double clicked
		}
	}

	this.mouseDragged = function(e) {
		if (dragging != null) {
			var upperLeftPoint = e.getPoint();
			upperLeftPoint.translate(-grabXoffset, -grabYoffset);
			var index = slots.findNearestSlotIndex(upperLeftPoint);

			if (index < 0)
				index = 0;
			if (index >= panels.length)
				index = panels.length;

            panels.remove(dragging);
            panels.insert(index, dragging);

			dragging.setLocation(upperLeftPoint);
			startDrifting();
		}
	}

	this.resized = function() {
		if (scrollPane.isVisible()) {
			var height = scrollPane.getViewport().getHeight();
			slots.setupSlots(panels.length, height);
			placeWidgets();
		}
	}

	this.driftPositions = function() {
		var anyMoved = false;
		for (var i = 0; i<panels.length; i++) {
			var pan = panels[i];
			if (pan != dragging) {
				var destination = slots.getPoint(i);
				var newX = closerCoord(pan.getX(), destination.x);
				var newY = closerCoord(pan.getY(), destination.y);

				if (newY != pan.getY() || newX != pan.getX()) {
					pan.setLocation(newX, newY);
					anyMoved = true;
				}
			}
		}
		if (!anyMoved)
			moveTimer.stop();
	}

	function closerCoord(current, target) {
		var gap = Math.abs(target - current);
		var increment = Math.ceil(0.12 * gap);
		if (current > target) {
			return current - increment;
		} else {
			return current + increment;
		}
	}

	this.getComponent = function() {
		return scrollPane;
	}

	function startDrifting() {
		moveTimer.start();
	}

	this.load = function(workOrders) {
		panels = [];
		for(var i = 0; i<workOrders.length; i++) {
			var workOrder = workOrders[i];
			panels.push(createWorkOrderPanel(workOrder));
		}
		this.resized();
	}

	function placeWidgets() {
		for(var i = 0; i<panels.length; i++) {
			var pan = panels[i];
			layeredPane.add(pan, 10);
			pan.setLocation(slots.getPoint(i));
		}
	}

	this.storeOrder = function() {
		// pretend we actually store the results somewhere.
	}
}

function createOrderingWidget() {
	// This is the way I found to subclass a Java class.  It is ugly, but works.
	// Rhino gurus probably have a better way.
	var ow = new JavaAdapter(MouseListener, MouseMotionListener, new _OrderingWidget());
	ow.setupHandlers();
	return ow;
}


function animationDemo() {

	var orderingWidget = createOrderingWidget();

	function populateRandomSampleData() {
		var wos = [];
		for (var i = 0; i < 35; i++) {
			var product = "Delivery for " + makeName();
			var urgency = java.lang.System.nanoTime() % 4 + 1;
			var workOrder = new WorkOrder(i, makeAddress(), product, urgency);
			wos.push(workOrder);
		}
		orderingWidget.load(wos);
	}

	function createAndShowGUI() {
		var frame = new JFrame("Rhine Swing Test Application - Animated Drag Drop Demo");
		var panel = new JPanel(new BorderLayout());
		var topLabel = new JLabel("Drag and drop the work orders below.");
		topLabel.setBorder(BorderFactory.createEmptyBorder(3, 3, 3, 3));
		panel.add(topLabel, BorderLayout.NORTH);
		panel.add(orderingWidget.getComponent(), BorderLayout.CENTER);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		panel.setOpaque(true); // content panes must be opaque
		frame.setContentPane(panel);
		frame.pack();
		frame.setVisible(true);

		populateRandomSampleData();
	}

	createAndShowGUI();
}
