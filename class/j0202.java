// program id : 5
// 1. แสดงการใช้คำสั่ง if .. else if ..
// 2. String ใช้ .equals
// 3. String ใช้ compareTo
import java.lang.*;
class j0202 {
  public static void main(String args[]) {
    int x;
    x = 6;
    if (x > 5) System.out.println("more than 5");
    else System.out.println("less than or equal 5");
    if (x > 10) System.out.println("more than 10");
    else { System.out.println("less than or equal 10"); } 
    if (0==0) { 
    System.out.println("true"); 
    } else if(1==1) { System.out.println("never reach here"); } 
    //
    String a[] = new String[6];
    a[0] = "5";
    a[1] = "60";
    a[2] = "abc";
    a[4] = "100";
    a[5] = "22";
    System.out.println(a[0] + " " + a[1] + " " + a[2]);
    if (a[2].equals("abc")) { System.out.println("equal"); }
    if (a[0].compareTo(a[1]) < 0) System.out.print(a[0]); // 5
    if (a[1].compareTo(a[0]) > 0) System.out.print(a[0]+""+a[1]); // 560
    if (a[0].compareTo(a[0]) == 0) System.out.print("equal"); // equal
    System.out.print(a[0].compareTo(a[1])); // -1
    System.out.print(a[0].compareTo(a[4])); // 4
    System.out.print(a[0].compareTo(a[5])); // 3
  }
}