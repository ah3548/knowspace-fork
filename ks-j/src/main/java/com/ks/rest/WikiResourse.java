package com.ks.rest;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.springframework.beans.factory.annotation.Autowired;

import com.ks.wiki.WikiBo;

@Path("/wiki")
public class WikiResourse {

	@Autowired
	WikiBo wikiBo;

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response savePayment() {

		Object result = wikiBo.getText("Dennis_Shasha");

		return Response.status(200).entity(result).build();

	}

}