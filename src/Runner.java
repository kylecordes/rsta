/* Rhino Swing Test Application
 * Kyle Cordes
 * http://kylecordes.com
 *
 * This fine is an attempt at a fairly minimal Java launchpad for
 * an application written as much as possible with Rhino / Javascript.
 */

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.ContextFactory;
import org.mozilla.javascript.EvaluatorException;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.ImporterTopLevel;
import org.mozilla.javascript.JavaScriptException;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.WrappedException;

public class Runner extends ScriptableObject {

	private static final long serialVersionUID = -3177482493159110328L;
	private Scriptable topLevelScope;

	@Override
	public String getClassName() {
		return "global";
	}

	public static void main(String args[]) {
		new Runner().go(args);
	}

	static class MyContextFactory extends ContextFactory {
		@Override
		protected boolean hasFeature(Context cx, int featureIndex) {
			switch (featureIndex) {
			case Context.FEATURE_STRICT_MODE:
			case Context.FEATURE_STRICT_VARS:
			case Context.FEATURE_STRICT_EVAL:
			case Context.FEATURE_WARNING_AS_ERROR:
				return true;
			}
			return super.hasFeature(cx, featureIndex);
		}
	};

	Context mainContext;

	private void go(String args[]) {
		ContextFactory contextFactory = new MyContextFactory();
		mainContext = contextFactory.enterContext();
		try {
			mainContext.setLanguageVersion(170); // This is the latest, as of July 2008.

			// publish a subset of what the "Shell" offers
			String[] names = { "print", "load" };
			defineFunctionProperties(names, Runner.class,
					ScriptableObject.DONTENUM);

			// Publish command line args, might be useful for JWS launching
			Object[] array;
			if (args.length == 0) {
				array = new Object[0];
			} else {
				int length = args.length - 1;
				array = new Object[length];
				System.arraycopy(args, 1, array, 0, length);
			}
			Scriptable argsObj = mainContext.newArray(this, array);
			defineProperty("arguments", argsObj, ScriptableObject.DONTENUM);

			String launchJS = "launch.js";
			if (args.length > 0) {
				launchJS = args[0];
			}

			topLevelScope = new ImporterTopLevel(mainContext);
			topLevelScope.put("intf", topLevelScope, this);

			processSource(mainContext, launchJS);
		} finally {
			Context.exit();
		}
	}

	public static void print(Context cx, Scriptable thisObj, Object[] args,
			Function funObj) {
		for (int i = 0; i < args.length; i++) {
			if (i > 0)
				System.out.print(" ");

			String s = Context.toString(args[i]);

			System.out.print(s);
		}
		System.out.println();
	}

	public static void load(Context cx, Scriptable thisObj, Object[] args,
			Function funObj) {
		// Find the instance
		Runner runner = (Runner) getTopLevelScope(thisObj);
		for (int i = 0; i < args.length; i++) {
			runner.processSource(cx, Context.toString(args[i]));
		}
	}

	public static InputStream getResourceAsStream(String resource)
			throws IOException {
		ClassLoader loader = Thread.currentThread().getContextClassLoader();
		InputStream in = null;
		if (loader != null)
			in = loader.getResourceAsStream(resource);
		if (in == null)
			in = ClassLoader.getSystemResourceAsStream(resource);
		if (in == null)
			throw new IOException("Could not find resource " + resource);
		return in;
	}

	private void processSource(Context cx, String filename) {
		Reader in = null;
		try {
			in = new InputStreamReader(getResourceAsStream(filename));
		} catch (IOException ex) {
			Context
					.reportError("Couldn't open resource: \"" + filename
							+ "\".");
			return;
		}

		try {
			cx.evaluateReader(topLevelScope, in, filename, 1, null);
		} catch (WrappedException we) {
			System.err.println("WrappedException, containing:");
			System.err.println(we.getWrappedException().toString());
			we.printStackTrace();
		} catch (EvaluatorException ee) {
			System.err.println("js: " + ee.getMessage());
			//ee.printStackTrace();
		} catch (JavaScriptException jse) {
			System.err.println("js: " + jse.getMessage());
		} catch (IOException ioe) {
			System.err.println(ioe.toString());
		} catch (Exception e) {
			System.err.println("Other Exception: " + e.toString());
			//e.printStackTrace();

		} finally {
			try {
				in.close();
			} catch (IOException ioe) {
				System.err.println(ioe.toString());
			}
		}
	}
}
