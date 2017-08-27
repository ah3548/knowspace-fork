package com.ks.util;

import java.util.Date;
import java.util.List;
import java.util.Map.Entry;

import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.sqs.AmazonSQS;
import com.amazonaws.services.sqs.AmazonSQSClientBuilder;
import com.amazonaws.services.sqs.model.CreateQueueRequest;
import com.amazonaws.services.sqs.model.DeleteMessageRequest;
import com.amazonaws.services.sqs.model.DeleteQueueRequest;
import com.amazonaws.services.sqs.model.GetQueueUrlRequest;
import com.amazonaws.services.sqs.model.Message;
import com.amazonaws.services.sqs.model.QueueDoesNotExistException;
import com.amazonaws.services.sqs.model.ReceiveMessageRequest;
import com.amazonaws.services.sqs.model.SendMessageRequest;

public class SQS {
	private AmazonSQS sqs;
	private String myQueueUrl;
	
	public SQS (String queueName) {
		AWSCredentials credentials = null;
        try {
            credentials = new ProfileCredentialsProvider().getCredentials();
        } catch (Exception e) {
            throw new AmazonClientException(
                    "Cannot load the credentials from the credential profiles file. " +
                    "Please make sure that your credentials file is at the correct " +
                    "location (~/.aws/credentials), and is in valid format.",
                    e);
        }

        sqs = AmazonSQSClientBuilder.standard()
				.withRegion(Regions.US_EAST_1)
				.build();
        
        try {
        	myQueueUrl = getQueue(queueName);
        }
        catch (QueueDoesNotExistException e) {
        	myQueueUrl = createQueue(queueName);
        }
	}
	
	public String createQueue(String queueName) {
        System.out.println("Creating a new SQS queue called " + queueName + ".\n");
        CreateQueueRequest createQueueRequest = new CreateQueueRequest(queueName);
        String myQueueUrl = sqs.createQueue(createQueueRequest).getQueueUrl();
        return myQueueUrl;
	}
	
	public String getQueue(String queueName) throws QueueDoesNotExistException {
		GetQueueUrlRequest qURLR = new GetQueueUrlRequest(queueName);
    	String myQueueUrl = sqs.getQueueUrl(qURLR).getQueueUrl();
    	return myQueueUrl;
	}
	
	public List<String> listQueue() {
	    System.out.println("Listing all queues in your account.\n");
        for (String queueUrl : sqs.listQueues().getQueueUrls()) {
            System.out.println("  QueueUrl: " + queueUrl);
        }
        System.out.println();
        return sqs.listQueues().getQueueUrls();
	}
	
	public void listMessages(String myQueueUrl) {
         System.out.println("Receiving messages from " + myQueueUrl + ".\n");
		 ReceiveMessageRequest receiveMessageRequest = new ReceiveMessageRequest(myQueueUrl);
         List<Message> messages = sqs.receiveMessage(receiveMessageRequest).getMessages();
         for (Message message : messages) {
             System.out.println("  Message");
             System.out.println("    MessageId:     " + message.getMessageId());
             System.out.println("    ReceiptHandle: " + message.getReceiptHandle());
             System.out.println("    MD5OfBody:     " + message.getMD5OfBody());
             System.out.println("    Body:          " + message.getBody());
             for (Entry<String, String> entry : message.getAttributes().entrySet()) {
                 System.out.println("  Attribute");
                 System.out.println("    Name:  " + entry.getKey());
                 System.out.println("    Value: " + entry.getValue());
             }
         }
         System.out.println();
	}
	
	public void sendMessage(String message) {
        System.out.println("Sending a message to MyQueue.\n");
        sqs.sendMessage(new SendMessageRequest(myQueueUrl, message));
	}
	
	public void deleteMessage() {
	    /*System.out.println("Deleting a message.\n");
        String messageReceiptHandle = messages.get(0).getReceiptHandle();
        sqs.deleteMessage(new DeleteMessageRequest(myQueueUrl, messageReceiptHandle));*/
	}
	
	public void deleteQueue() {
        System.out.println("Deleting the test queue.\n");
        sqs.deleteQueue(new DeleteQueueRequest(myQueueUrl));
	}
	
	
	
	/*public void execute() {
        try {
        

        } catch (AmazonServiceException ase) {
            System.out.println("Caught an AmazonServiceException, which means your request made it " +
                    "to Amazon SQS, but was rejected with an error response for some reason.");
            System.out.println("Error Message:    " + ase.getMessage());
            System.out.println("HTTP Status Code: " + ase.getStatusCode());
            System.out.println("AWS Error Code:   " + ase.getErrorCode());
            System.out.println("Error Type:       " + ase.getErrorType());
            System.out.println("Request ID:       " + ase.getRequestId());
        } catch (AmazonClientException ace) {
            System.out.println("Caught an AmazonClientException, which means the client encountered " +
                    "a serious internal problem while trying to communicate with SQS, such as not " +
                    "being able to access the network.");
            System.out.println("Error Message: " + ace.getMessage());
        }
	}*/
}
