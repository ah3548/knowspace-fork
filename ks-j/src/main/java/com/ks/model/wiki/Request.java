package com.ks.model.wiki;


import java.util.HashMap;
import java.util.Map;

public class Request {
	private Map<String, String> params;
	private String subject;
	
	public Request(String subject) {
		this.subject = subject;
		this.params = new HashMap<String, String>();
		
		params.put("format", "json");
		params.put("redirects", "");
	}
	
	public void setTypeText() {
		params.put("titles", subject);
		params.put("action", "query");
		params.put("prop", "extracts");
		
		params.put("explaintext", "");
		params.put("indexpageids", "");
	}
	
	public void setTypeHtml() {
		params.put("page", subject);
		params.put("action", "parse");
		params.put("prop", "text|links");
		
		params.put("noimages", "");
		params.put("disabletoc", "");
		params.put("disableeditsection", "");
		params.put("disablelimitreport", "");
	}
	
	
	public Map<String, String> getParams() {
		return params;
	}
}
