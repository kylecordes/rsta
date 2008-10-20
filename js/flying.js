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


/*

// Slots object manages the places on the screen where a box can be.

function Slots() {
	
	private JLayeredPane layeredPane;
	
	private List<Point> points = new ArrayList<Point>();

	public Slots(JLayeredPane layeredPane) {
		this.layeredPane = layeredPane;
	}

	private static final int LEFT_MARGIN = 30;

	private static final int TOP_MARGIN = 3;

	private static final int RIGHT_MARGIN = 3;

	private static final int BOTTOM_MARGIN = 3;

	private static final int HOR_GAP = 38;

	private static final int VER_GAP = 4;

    private static final int LABEL_LAYER = 5;

	private static final int LABEL_OFFSET_X = -25;

	private JPanel samplePanel = new WorkOrderPanel(new WorkOrder(0, "", "", 1));

	private int panelHeight = samplePanel.getHeight();

	private int panelWidth = samplePanel.getWidth();

	private int rowSize = panelHeight + VER_GAP;

	private int colSize = panelWidth + HOR_GAP;

	private int slotsPerColumn = 0;

	public void setupSlots(int numSlots, int height) {
		height -= TOP_MARGIN;
		height -= BOTTOM_MARGIN;
		int newStackSize = height / rowSize;
		if (slotsPerColumn == newStackSize)
			return;
		
		slotsPerColumn = newStackSize;
		
		layeredPane.removeAll();
		points.clear();

		int sizeX = 0, sizeY = 0;

		for (int i = 0; i < numSlots; i++) {
			int row = i % slotsPerColumn;
			int col = i / slotsPerColumn;

			int x = colSize * col + LEFT_MARGIN;
			int y = rowSize * row + TOP_MARGIN;

			int maxX = x + panelWidth + RIGHT_MARGIN;
			int maxY = y + panelHeight + BOTTOM_MARGIN;

			if (maxX > sizeX)
				sizeX = maxX;

			if (maxY > sizeY)
				sizeY = maxY;

			Point point = new Point(x, y);
			points.add(point);

			Point labelPoint = point.getLocation();
			labelPoint.translate(LABEL_OFFSET_X, 0);
			JLabel lab = new JLabel("#" + (i + 1) + ":");
			lab.setSize(lab.getPreferredSize());
			lab.setLocation(labelPoint);
			layeredPane.add(lab, LABEL_LAYER);
		}
		layeredPane.setPreferredSize(new Dimension(sizeX, sizeY));
	}

	public int findNearestSlotIndex(Point point) {
		int nearestIndex = 0;
		Point nearestPointSoFar = null;
		int index = 0;

		for (Point slot : points) {
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
			index++;
		}
		return nearestIndex;
	}

	public Point getPoint(int i) {
		return points.get(i);
	}

}



import java.awt.Component;
import java.awt.Dimension;
import java.awt.Point;
import java.awt.event.ActionListener;
import java.awt.event.ComponentAdapter;
import java.awt.event.ComponentEvent;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.beans.EventHandler;
import java.util.ArrayList;
import java.util.List;

import javax.swing.BorderFactory;
import javax.swing.JComponent;
import javax.swing.JLayeredPane;
import javax.swing.JScrollPane;
import javax.swing.Timer;


public class OrderingWidget implements MouseListener, MouseMotionListener {  // ActionListener

	private List<WorkOrderPanel> panels = new ArrayList<WorkOrderPanel>();

	private WorkOrderPanel dragging;

	private int grabXoffset, grabYoffset;

	private final JLayeredPane layeredPane = new JLayeredPane();

	private final JScrollPane scrollPane = new JScrollPane(layeredPane);

	private final Slots slots = new Slots(layeredPane);
	
	private final Timer moveTimer;

	public OrderingWidget() {
		layeredPane.addMouseListener(this);
		layeredPane.addMouseMotionListener(this);

		scrollPane.setBorder(BorderFactory.createEmptyBorder());
		scrollPane.setPreferredSize(new Dimension(500, 400));
		scrollPane.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_NEVER);
		scrollPane.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_ALWAYS);

		scrollPane.addComponentListener(new ComponentAdapter() {
			public void componentResized(ComponentEvent e) {
				resized();
            }
        });

        moveTimer = new Timer(25, (ActionListener) EventHandler.create(
                ActionListener.class, this, "driftPositions"));
    }

	// **************** Mouse Event Handlers ******************
	
	public void mouseEntered(MouseEvent e) {
	}

	public void mouseExited(MouseEvent e) {
	}

	public void mouseMoved(MouseEvent e) {
	}

	public void mousePressed(MouseEvent e) {
		Component c = layeredPane.getComponentAt(e.getPoint());
		if (c instanceof WorkOrderPanel) {
			dragging = (WorkOrderPanel) c;
			dragging.highlight();
			layeredPane.setLayer(dragging, 20);
			grabXoffset = e.getX() - c.getX();
			grabYoffset = e.getY() - c.getY();
		}
	}

	public void mouseReleased(MouseEvent e) {
		if (dragging != null) {
			layeredPane.setLayer(dragging, 10);
			dragging.unHighlight();
			dragging = null;
			startDrifting();
			storeOrder();
		}
	}

	public void mouseClicked(MouseEvent e) {
		if (e.getClickCount() == 2) {
            // double clicked
		}
	}

	public void mouseDragged(MouseEvent e) {
		if (dragging != null) {
			Point upperLeftPoint = e.getPoint();
			upperLeftPoint.translate(-grabXoffset, -grabYoffset);
			int index = slots.findNearestSlotIndex(upperLeftPoint);

			if (index < 0)
				index = 0;
			if (index >= panels.size())
				index = panels.size();

            panels.remove(dragging);
            panels.add(index, dragging);

			dragging.setLocation(upperLeftPoint);
			startDrifting();
		}
	}

	private void resized() {
		if (scrollPane.isVisible()) {
			int height = scrollPane.getViewport().getHeight();
			slots.setupSlots(panels.size(), height);
			placeWidgets();
		}
	}

    public void driftPositions() {
		int i = 0;
		boolean anyMoved = false;
		for (WorkOrderPanel pan : panels) {
			if (pan != dragging) {
				Point destination = slots.getPoint(i);
				int newX = closerCoord(pan.getX(), destination.x);
				int newY = closerCoord(pan.getY(), destination.y);

				if (newY != pan.getY() || newX != pan.getX()) {
					pan.setLocation(newX, newY);
					anyMoved = true;
				}
			}
			i++;
		}
		if (!anyMoved)
			moveTimer.stop();
	}

	private static int closerCoord(int current, int target) {
		float gap = Math.abs(target - current);
		int increment = (int) Math.ceil(0.1 * gap);
		if (current > target) {
			return current - increment;
		} else {
			return current + increment;
		}
	}

	public JComponent getComponent() {
		return scrollPane;
	}

	private void startDrifting() {
		moveTimer.start();
	}

	public void load(List<WorkOrder> workOrders) {
		panels.clear();
		for (WorkOrder workOrder : workOrders) {
			panels.add(new WorkOrderPanel(workOrder));
		}
		resized();
	}

	private void placeWidgets() {
		int i = 0;
		for (WorkOrderPanel pan : panels) {
			layeredPane.add(pan, 10);
			Point p = slots.getPoint(i);
			pan.setLocation(p);
			i++;
		}
	}

	private void storeOrder() {
		
	}



function animationDemo() {

	var orderingWidget = new OrderingWidget();

	function populateRandomSampleData() {
		List<WorkOrder> wos = new ArrayList<WorkOrder>();
		for (int i = 0; i < 30; i++) {
			String product = "Delivery for " + RandomData.makeName();
			int urgency = (int) (System.nanoTime() % 4 + 1);
			WorkOrder wo = new WorkOrder(i, RandomData.makeAddress(), product,
					urgency);
			wos.add(wo);
		}

		orderingWidget.load(wos);
	}

	function createAndShowGUI() {
		JFrame frame = new JFrame("Rhine Swing Test Application - Animated Drag Drop Demo");
		JPanel panel = new JPanel(new BorderLayout());
		JLabel topLabel = new JLabel("Drag and drop the work orders below.");
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

*/
