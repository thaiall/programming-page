// program id : 24
// create tmp.txt & tmpc.txt
// write or replace file 256 byte in ascii character 
import java.io.*;
public class j0604 {
  public static void main (String args[]) throws IOException {
    FileOutputStream fout1 = new FileOutputStream("tmp.txt");
    for(int i=0;i<256;i++) { fout1.write(i); }
    fout1.close();
    FileOutputStream fout2 = new FileOutputStream("tmpc.txt");
    for(char c='a';c<='z';c++) { fout2.write(c); }
    fout2.close();
  }
}
