// program id : 28
// readline from tmp.txt and print
import java.io.*;
public class j0608 {
  public static void main (String args[]) throws IOException {
    int i = 1;
    String b;
    FileReader fin = new FileReader("data.txt");
    BufferedReader bin = new BufferedReader(fin);
    // System.out.println(i = 1); // output is 1
    // System.out.println(b = bin.readLine()); // is ok
    while ((b =  bin.readLine()) != null) {
      System.out.println(i + " : " +b);
      i = i + 1;
    }
    System.out.println(b = bin.readLine()); // null
    fin.close();
  }
}
