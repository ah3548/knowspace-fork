package com.ks.wiki.impl;

import java.util.Map.Entry;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;

import org.glassfish.jersey.client.ClientProperties;
import org.glassfish.jersey.client.ClientResponse;

import com.ks.model.wiki.Request;
import com.ks.wiki.WikiBo;

public class WikiBoImpl implements WikiBo {

	final String WIKI_HOST = "https://en.wikipedia.org/w/api.php";
	
	public Object getText(String subject) {
		String output = "Try again Amir";

		try {			
			Client client = ClientBuilder.newClient();
			WebTarget target = client.target(WIKI_HOST);
			
			Request textR = new Request(subject);
			textR.setTypeText();
			
			for (Entry<String, String> e : textR.getParams().entrySet()) {
				target = target.queryParam(e.getKey(), e.getValue());
			};
			
			System.out.println(target.getUri());
			
			ClientResponse response = 
					target
						.request(MediaType.APPLICATION_JSON)
						.get(ClientResponse.class);

			if (response.getStatus() != 200) {
				throw new RuntimeException("Failed : HTTP error code : " + response.getStatus());
			}

			output = response.getEntity().toString();

			return output;

		} catch (Exception e) {
			e.printStackTrace();
		}
		return output;
	}

}