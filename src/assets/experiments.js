const experiments = [
    { title: 'ls command', code: 
   `#include<stdio.h>
    #include<dirent.h>    //handle directory
    #include<sys/stat.h>  //file info
    #include<pwd.h>       //user info
    #include<grp.h>       
    #include<time.h>
    
    int main() {
    DIR *d;              //directory
    struct dirent *de;   //directory entry
    struct stat buf;     //file info
    int i,j;
    char P[10]="rwxrwxrwx",AP[10]=" ";
    struct passwd *p;
    struct group *g;
    struct tm *t;
    char time[26];
    d=opendir(".");
    readdir(d);
    readdir(d);
    while( (de=readdir(d))!=NULL) //read all entries until end of directory
    {
    stat(de->d_name,&buf);
    // File Type
    if(S_ISDIR(buf.st_mode))
    printf("d");
    else if(S_ISREG(buf.st_mode))
    printf("-");
    else if(S_ISCHR(buf.st_mode))
    printf("c");
    else if(S_ISBLK(buf.st_mode))
    printf("b");
    else if(S_ISLNK(buf.st_mode))
    printf("l");
    else if(S_ISFIFO(buf.st_mode))
    printf("p");
    else if(S_ISSOCK(buf.st_mode))
    printf("s");
    
    //File Permissions P-Full Permissions AP-Actual Permissions
    for(i=0,j=(1<<8);i<9;i++,j>>=1)
    AP[i]= (buf.st_mode & j ) ? P[i] : '-' ;
    printf("%s",AP);
    
    //No. of Hard Links
    printf("%5d",buf.st_nlink);
    
    //User Name
    p=getpwuid(buf.st_uid);
    printf(" %.8s",p->pw_name);
    
    //Group Name
    g=getgrgid(buf.st_gid);
    printf(" %-8.8s",g->gr_name);
    
    //File Size
    printf(" %8d",buf.st_size);
    
    //Date and Time of modification
    t=localtime(&buf.st_mtime);
    strftime(time,sizeof(time),"%b %d %H:%M",t);
    printf(" %s",time);
    
    //File Name
    printf(" %s\\n",de->d_name);
    }
    
    }` },
    { title: 'cp command', code: `#include <stdio.h>
    #include <stdlib.h>
    #include <fcntl.h> //file control
    #include <errno.h>
    #include <sys/types.h> 
    #include <unistd.h> //file operations
    
    #define BUF_SIZE 8192
    int main(int argc, char* argv[]) {
    int input_fd, output_fd; //Input and output file descriptors
    ssize_t ret_in, ret_out; // Number of bytes returned by read() and write() 
    char buffer[BUF_SIZE]; //Character buffer 
    
    // Are src and dest file name arguments missing 
    if(argc != 3){
    printf ("Usage: cp file1 file2");
    return 1;
    }
    
    // Create input file descriptor 
    input_fd = open (argv [1], O_RDONLY);  //opens in read-only mode
    if (input_fd == -1) {
    perror ("open");
    return 2;
    }
    // Create output file descriptor 
    output_fd = open(argv[2], O_WRONLY | O_CREAT, 0644); //opens in write mode, if no file, then creates it
    if(output_fd == -1){
      perror("open");
      return 3;
    }
    
    // Copy process
    while((ret_in = read (input_fd, &buffer, BUF_SIZE)) > 0){
    ret_out = write (output_fd, &buffer, (ssize_t) ret_in);
    if(ret_out != ret_in){
       /* Write error */
       perror("write");
       return 4;
    }
    
    }
    // Close file descriptors 
    close (input_fd);
    close (output_fd);
    return (EXIT_SUCCESS);
    }` },
    { title: 'mv command', code: `#include <stdio.h>
    #include <stdlib.h>
    #include <fcntl.h> //file control
    #include <errno.h>
    #include <sys/types.h> 
    #include <unistd.h> //file operations
    
    int main(int argc, char* argv[]) {
    int input_fd, output_fd; // Input and output file descriptors
    
    // Are src and dest file name arguments missing 
    if(argc != 3){
    printf ("Usage: mv file1 file2");
    return 1;
    }
    // Create input file descriptor 
    input_fd = link(argv [1], argv[2]); //creates hard link between source and destination
    if (input_fd == -1) {
    perror ("link error");
    return 2;
    }
    // Create output file descriptor 
    output_fd = unlink(argv[1]);  //remove source file
    if(output_fd == -1){
    perror("unlink");
    return 3;
    }
    
    }`},
    { title: 'rm command', code: `#include <stdio.h>
    #include <stdlib.h>
    #include <fcntl.h> //file control
    #include <errno.h>
    #include <sys/types.h> 
    #include <unistd.h> //file operations
    
    int main(int argc, char* argv[]) { 
    int output_fd = unlink(argv[1]);  //unlink to delete the file
      if(output_fd == -1){
      perror("unlink error");
      return 3;
    }
    }`},
    { title: 'Process Control System Calls', code: `#include<stdio.h>
    #include<string.h>
    #include<sys/types.h>
    #include<stdlib.h>
    #include<unistd.h> //access to POSIX API- ex: getpid(),getppid(),fork()
    #include<wait.h>
    
    int main(int argc, char *argv[]){
    printf("Main Function: \n");
    int retval=1;
    pid_t pid=fork();
    
    if(pid<0){
    printf("Error in fork operation\n");
    }
    
    if(pid==0){
    printf("PID for Child process: %d \nPID of its parent process: %d\n",getpid(),getppid());
    execl("./binsearch",argv[1],NULL); //object file of child process program-binsearch.c
    }
    
    else{
    printf("PID of parent process: %d\n",getpid());
    wait(&retval); //wait for child process to terminate
    
    if(WIFEXITED(retval)==1) //child process exit status
    {
    printf("Child terminated normally\n");
    }
    else{
    printf("Child terminated abnormally\n");
    exit(0);
    }
    
    }
    return 0;
    }`},
    { title: 'Thread management using Pthreads', code: `#include<stdio.h>
    #include<pthread.h> //handle pthread operations
    #include<sys/types.h>
    #include<stdlib.h>
    #include<unistd.h>
    #include<math.h>
    
    int a[4][4],b[4][4];
    
    //thread calling function
    void *matrixeval (void *val){
        int *thno = (int*)val;
        for(int i=0;i<4;i++)
          b[(*thno)][i]=a[(*thno)][i];
    
        for(int i=0;i<4;i++){
         for(int j=0;j<(*thno);j++)
          b[(*thno)][i]=b[(*thno)][i]*a[(*thno)][i]; 
          //b matrix stores elements of a matrix raised to power of row number
        }
        printf("(%d)thread \n",(*thno+1)); //thread no. for each operation
    }
    
    int main(){
        pthread_t tid[4];
        for(int i=0;i<4;i++){
            printf("Enter elements of row %d: ",i+1);
            for(int j=0;j<4;j++)
              scanf("%d",&a[i][j]);
        }
        printf("Before processing: \\n");
        for(int i=0; i<4;i++){
            for(int j=0;j<4;j++)
              printf("%d ",a[i][j]);
            printf("\n");
        }
        //Create threads for corresponding row operation
        for(int i=0;i<4;i++){
            pthread_create(&tid[i], NULL, matrixeval, (void*)&i); 
            sleep(1); //delay in thread creation
        }
        //calling thread waits for threads to terminate
        for(int i=0;i<4;i++){
            pthread_join(tid[i], NULL);
            sleep(1);
        }
        printf("After processing: \\n");
        for(int i=0; i<4;i++){
            for(int j=0;j<4;j++)
              printf("%d ",b[i][j]);
            printf("\\n");
        }
        pthread_exit(NULL); //terminates calling thread
        return 0;
    }`},
    { title: 'Reader-Writer problem', code: `#include<stdio.h>
    #include<stdlib.h>
    #include<pthread.h>
    #include<semaphore.h> //semaphore operations
    
    int count=0,rcount=0; // page no., no. of readers
    sem_t mutex,wr; 
    
    void* writer(void *p){
    int* i =(int*)p;
    sem_wait(&wr);//blocks writer access to 'count', until acquire 'wr'
    printf("\nWriter %d writes page number %d",*i,++count);
    sem_post(&wr); //release of 'wr' semaphore to allow other writer threads
    }
    
    void* reader(void* p){
    int* i =(int*)p;
    sem_wait(&mutex);//mutual exclusion to allow only reader to modify 'rcount' at a time
    rcount++;
    if(rcount==1)
      sem_wait(&wr);//blocks writer access to 'count', until acquire 'wr'
    
    sem_post(&mutex);//release of 'mutex' semaphore to allow other reader threads
    printf("\nReader %d reads page number %d ",*i,count);
    sem_wait(&mutex);//mutual exclusion to allow only reader to modify 'rcount' at a time
    rcount--;
    
    if(rcount==0)
      sem_post(&wr);//release of 'wr' semaphore to allow  writer threads
    
    sem_post(&mutex);//release of 'wr' semaphore to allow other reader threads
    }
    
    int main(){
    //Initialize semaphores
    sem_init(&mutex,0,1); 
    sem_init(&wr,0,1); 
    int a[6]={1,2,3,1,2,3};
    pthread_t p[6];
    
    for(int i=0;i<3;i++) pthread_create(&p[i],NULL,writer,&a[i]); //writer threads
    for(int i=3;i<6;i++) pthread_create(&p[i],NULL,reader,&a[i]); //reader threads
    for(int i=0;i<6;i++) pthread_join(p[i],NULL);
    
    }`},
    // Add more experiments here...
  ];


  export default experiments