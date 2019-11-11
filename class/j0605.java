// program id : 25
// make data 0 - 9 in 10 lines 
import java.io.*;
public class j0605 {
  public static void main (String args[]) throws IOException {
    FileOutputStream fout = new FileOutputStream("tmp.txt");
    for(int i=1;i<=10;i++) {       
      fout.write(i+47);
      fout.write(13);
      fout.write(10);
    }
    fout.close();
    FileOutputStream foutc = new FileOutputStream("tmpc.txt");
    for(char i='a';i<='z';i++) {       
      foutc.write(i); // tmpc.txt have a to z with 26 bytes
    }
    foutc.close();	
  }
}
