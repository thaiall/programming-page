/* Pyramid No.3 from 36 style */
public class pyramid03 {
	public static void main(String args[])   {
		int totalRow = 4;
		for (int row=1; row <= totalRow; row++) {
			// Column have 3 parts 
			System.out.print(row + "" + (row + 4));
			for (int col=1; col <= (4 + row); col++) { 
				System.out.print("*"); 
			}
			System.out.println();
		}
	}
}
/* https://gist.github.com/04dd20c634c0292f8cc81a728c112f2f */