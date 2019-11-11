/* Pyramid No.4 from 36 style */
public class pyramid04 {
	public static void main(String args[]) {
		int totalRow = 4;
		for (int row=1; row <= totalRow; row++) {
			// Column have 3 parts 
			for (int col=1; col <= row; col++) { System.out.print("*"); }
			for (int col=row; col >= 2; col--) { System.out.print(col); }
			for (int col=1; col <= row; col++) { System.out.print(col); }
			System.out.println();
		}
	}
}
/* https://gist.github.com/02bb2120150cd70c628707058566f520 */