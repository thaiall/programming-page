/* Pyramid No.1 from 36 style */
public class pyramid01 {
	public static void main(String args[]) {
		int totalRow = 4;
		for (int row=1; row <= totalRow; row++) {
			// Column have 4 parts 
			for (int col=2; col <= row; col++) { System.out.print(" "); }
			System.out.print(row + "" + row);
			for (int col=totalRow; col >= (row + 1); col--) { System.out.print("**"); }
			System.out.println( row + "" + row);
		}
	}
}
/* https://gist.github.com/89902218c97365439a0ca5ce346516f0 */